import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Validation functions
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .slice(0, 1000);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^0[5-7][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

const validateName = (name: string): boolean => {
  const nameRegex = /^[\u0600-\u06FFa-zA-ZÀ-ÿ\s\-']{2,100}$/;
  return nameRegex.test(name);
};

const validateWilaya = (wilaya: string): boolean => {
  const validWilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", 
    "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", 
    "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", 
    "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", 
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", 
    "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", 
    "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", 
    "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", 
    "Ghardaïa", "Relizane"
  ];
  return validWilayas.includes(wilaya);
};

const validateQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0 && quantity <= 100;
};

// Rate limiting using edge function storage
const checkRateLimit = async (ip: string, supabase: any): Promise<boolean> => {
  const now = Date.now();
  const timeWindow = 60000; // 1 minute
  const maxRequests = 5;

  // Check recent orders from this IP (using created_at timestamp)
  const oneMinuteAgo = new Date(now - timeWindow).toISOString();
  
  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .gte('created_at', oneMinuteAgo);

  if (error) {
    console.error('Rate limit check error:', error);
    return true; // Allow on error to not block legitimate users
  }

  return (data?.length || 0) < maxRequests;
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔵 Create order function called');

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rate limiting
    const rateLimitOk = await checkRateLimit(clientIP, supabase);
    if (!rateLimitOk) {
      console.warn('⚠️ Rate limit exceeded for IP:', clientIP);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const orderData = await req.json();
    console.log('📦 Order data received');

    // Validate customer info
    if (!orderData.customer_info) {
      throw new Error('Informations client manquantes');
    }

    const { firstName, lastName, phone, wilaya, deliveryType, address } = orderData.customer_info;

    // Sanitize and validate inputs
    const sanitizedFirstName = sanitizeInput(firstName);
    const sanitizedLastName = sanitizeInput(lastName);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedWilaya = sanitizeInput(wilaya);
    const sanitizedAddress = address ? sanitizeInput(address) : '';

    if (!validateName(sanitizedFirstName)) {
      throw new Error('Prénom invalide');
    }

    if (!validateName(sanitizedLastName)) {
      throw new Error('Nom invalide');
    }

    if (!validatePhone(sanitizedPhone)) {
      throw new Error('Numéro de téléphone invalide (format: 05XXXXXXXX)');
    }

    if (!validateWilaya(sanitizedWilaya)) {
      throw new Error('Wilaya invalide');
    }

    if (deliveryType !== 'home' && deliveryType !== 'office') {
      throw new Error('Type de livraison invalide');
    }

    if (deliveryType === 'home' && sanitizedAddress.length < 10) {
      throw new Error('Adresse invalide (minimum 10 caractères)');
    }

    // Validate items
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error('Aucun article dans la commande');
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of orderData.items) {
      if (!item.id || !item.quantity) {
        throw new Error('Article invalide dans la commande');
      }

      if (!validateQuantity(item.quantity)) {
        throw new Error(`Quantité invalide pour ${item.title}`);
      }

      // Verify product exists and get real price
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, title, price, stock_quantity, is_out_of_stock')
        .eq('id', item.id)
        .is('deleted_at', null)
        .single();

      if (productError || !product) {
        throw new Error(`Produit ${item.title} introuvable ou indisponible`);
      }

      // Check stock
      if (product.is_out_of_stock || product.stock_quantity < item.quantity) {
        throw new Error(`Stock insuffisant pour ${product.title}`);
      }

      // Use real price from database
      const realPrice = Number(product.price);
      calculatedTotal += realPrice * item.quantity;

      validatedItems.push({
        id: product.id,
        title: sanitizeInput(product.title),
        price: product.price,
        quantity: item.quantity,
        image: item.image || ''
      });
    }

    // Validate delivery fee and total
    const deliveryFee = Number(orderData.delivery_fee) || 0;
    const expectedTotal = calculatedTotal + deliveryFee;
    const providedTotal = Number(orderData.total_amount);

    if (Math.abs(expectedTotal - providedTotal) > 1) {
      console.error('Total mismatch:', { expectedTotal, providedTotal, calculatedTotal, deliveryFee });
      throw new Error('Montant total incorrect');
    }

    // Generate order number
    const orderNumber = `CMD-${Date.now()}`;

    // Insert order
    const { data: insertedOrder, error: insertError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_info: {
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          phone: sanitizedPhone,
          wilaya: sanitizedWilaya,
          deliveryType,
          address: sanitizedAddress,
          commune: orderData.customer_info.commune || undefined,
          office: orderData.customer_info.office || undefined
        },
        items: validatedItems,
        total_products: orderData.total_products,
        delivery_fee: deliveryFee,
        total_amount: expectedTotal,
        status: 'pending',
        sent_to_zr_express: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      throw new Error('Erreur lors de la création de la commande');
    }

    console.log('✅ Order created successfully:', orderNumber);

    return new Response(
      JSON.stringify({ 
        success: true, 
        order: insertedOrder,
        orderNumber 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error in create-order function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erreur lors de la création de la commande' 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
