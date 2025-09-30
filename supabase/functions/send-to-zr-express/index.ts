import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Mapping des noms de wilayas vers leurs IDs ZR Express
const wilayaIds: Record<string, string> = {
  "Adrar": "1", "Chlef": "2", "Laghouat": "3", "Oum El Bouaghi": "4",
  "Batna": "5", "Béjaïa": "6", "Biskra": "7", "Béchar": "8",
  "Blida": "9", "Bouira": "10", "Tamanrasset": "11", "Tébessa": "12",
  "Tlemcen": "13", "Tiaret": "14", "Tizi Ouzou": "15", "Alger": "16",
  "Djelfa": "17", "Jijel": "18", "Sétif": "19", "Saïda": "20",
  "Skikda": "21", "Sidi Bel Abbès": "22", "Annaba": "23", "Guelma": "24",
  "Constantine": "25", "Médéa": "26", "Mostaganem": "27", "M'Sila": "28",
  "Mascara": "29", "Ouargla": "30", "Oran": "31", "El Bayadh": "32",
  "Illizi": "33", "Bordj Bou Arreridj": "34", "Boumerdès": "35", "El Tarf": "36",
  "Tindouf": "37", "Tissemsilt": "38", "El Oued": "39", "Khenchela": "40",
  "Souk Ahras": "41", "Tipaza": "42", "Mila": "43", "Aïn Defla": "44",
  "Naâma": "45", "Aïn Témouchent": "46", "Ghardaïa": "47", "Relizane": "48",
  "Timimoun": "49", "Bordj Badji Mokhtar": "50", "Ouled Djellal": "51",
  "Béni Abbès": "52", "In Salah": "53", "In Guezzam": "54",
  "Touggourt": "55", "Djanet": "56", "El M'Ghair": "57", "El Meniaa": "58"
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderData {
  orderNumber: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    wilaya: string;
    deliveryType: 'home' | 'office';
    address?: string;
    commune?: string;
    office?: string;
  };
  items: Array<{
    id: string;
    title: string;
    price: string;
    quantity: number;
    image: string;
  }>;
  totalProducts: number;
  deliveryFee: number;
  totalAmount: number;
}

// Mapping des wilayas vers leurs IDs ZR Express
const wilayaMapping: Record<string, { id: string; commune: string }> = {
  "Adrar": { id: "1", commune: "Adrar" },
  "Chlef": { id: "2", commune: "Chlef" },
  "Laghouat": { id: "3", commune: "Laghouat" },
  "Oum El Bouaghi": { id: "4", commune: "Oum El Bouaghi" },
  "Batna": { id: "5", commune: "Batna" },
  "Béjaïa": { id: "6", commune: "Béjaïa" },
  "Biskra": { id: "7", commune: "Biskra" },
  "Béchar": { id: "8", commune: "Béchar" },
  "Blida": { id: "9", commune: "Blida" },
  "Bouira": { id: "10", commune: "Bouira" },
  "Tamanrasset": { id: "11", commune: "Tamanrasset" },
  "Tébessa": { id: "12", commune: "Tébessa" },
  "Tlemcen": { id: "13", commune: "Tlemcen" },
  "Tiaret": { id: "14", commune: "Tiaret" },
  "Tizi Ouzou": { id: "15", commune: "Tizi Ouzou" },
  "Alger": { id: "16", commune: "Alger Centre" },
  "Djelfa": { id: "17", commune: "Djelfa" },
  "Jijel": { id: "18", commune: "Jijel" },
  "Sétif": { id: "19", commune: "Sétif" },
  "Saïda": { id: "20", commune: "Saïda" },
  "Skikda": { id: "21", commune: "Skikda" },
  "Sidi Bel Abbès": { id: "22", commune: "Sidi Bel Abbès" },
  "Annaba": { id: "23", commune: "Annaba" },
  "Guelma": { id: "24", commune: "Guelma" },
  "Constantine": { id: "25", commune: "Constantine" },
  "Médéa": { id: "26", commune: "Médéa" },
  "Mostaganem": { id: "27", commune: "Mostaganem" },
  "M'Sila": { id: "28", commune: "M'Sila" },
  "Mascara": { id: "29", commune: "Mascara" },
  "Ouargla": { id: "30", commune: "Ouargla" },
  "Oran": { id: "31", commune: "Oran" },
  "El Bayadh": { id: "32", commune: "El Bayadh" },
  "Illizi": { id: "33", commune: "Illizi" },
  "Bordj Bou Arréridj": { id: "34", commune: "Bordj Bou Arréridj" },
  "Boumerdès": { id: "35", commune: "Boumerdès" },
  "El Tarf": { id: "36", commune: "El Tarf" },
  "Tindouf": { id: "37", commune: "Tindouf" },
  "Tissemsilt": { id: "38", commune: "Tissemsilt" },
  "El Oued": { id: "39", commune: "El Oued" },
  "Khenchela": { id: "40", commune: "Khenchela" },
  "Souk Ahras": { id: "41", commune: "Souk Ahras" },
  "Tipaza": { id: "42", commune: "Tipaza" },
  "Mila": { id: "43", commune: "Mila" },
  "Aïn Defla": { id: "44", commune: "Aïn Defla" },
  "Naâma": { id: "45", commune: "Naâma" },
  "Aïn Témouchent": { id: "46", commune: "Aïn Témouchent" },
  "Ghardaïa": { id: "47", commune: "Ghardaïa" },
  "Relizane": { id: "48", commune: "Relizane" }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TOKEN = Deno.env.get('ZR_EXPRESS_TOKEN');
    const KEY = Deno.env.get('ZR_EXPRESS_KEY');
    
    if (!TOKEN || !KEY) {
      console.error('Missing ZR Express credentials');
      return new Response(
        JSON.stringify({ error: 'Configuration manquante pour ZR Express' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const orderData: OrderData = await req.json();
    console.log('Commande reçue:', JSON.stringify(orderData, null, 2));

    // Construire les données pour ZR Express
    const wilayaInfo = wilayaMapping[orderData.customerInfo.wilaya] || { id: "16", commune: "Alger Centre" };
    const clientName = `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`;
    const productsList = orderData.items.map(item => `${item.title} x${item.quantity}`).join(', ');
    
    const zrExpressData = {
      "Colis": [{
        "Tracking": orderData.orderNumber,
        "TypeLivraison": orderData.customerInfo.deliveryType === 'home' ? "0" : "1", // 0 = domicile, 1 = stopdesk
        "TypeColis": "0", // 0 = normal, 1 = échange
        "Confrimee": "1", // 1 = confirmer directement
        "Client": clientName,
        "MobileA": orderData.customerInfo.phone,
        "MobileB": "",
        "Adresse": orderData.customerInfo.address || `${orderData.customerInfo.wilaya} - ${orderData.customerInfo.deliveryType}`,
        "IDWilaya": wilayaInfo.id,
        "Commune": orderData.customerInfo.deliveryType === 'home' 
          ? (orderData.customerInfo.commune || wilayaInfo.commune)
          : wilayaInfo.commune,
        "Total": orderData.totalAmount.toString(),
        "Note": `Commande ${orderData.orderNumber} - ${orderData.totalProducts} produit(s)${orderData.customerInfo.deliveryType === 'office' ? ' - Point de retrait: ' + orderData.customerInfo.office : ''}`,
        "TProduit": productsList,
        "id_Externe": orderData.orderNumber,
        "Source": "Lovable Boutique"
      }]
    };

    console.log('Données envoyées à ZR Express:', JSON.stringify(zrExpressData, null, 2));

    // Envoyer à l'API ZR Express
    const response = await fetch('https://procolis.com/api_v1/add_colis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': TOKEN,
        'key': KEY
      },
      body: JSON.stringify(zrExpressData)
    });

    const responseText = await response.text();
    console.log(`Réponse ZR Express (${response.status}):`, responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { rawResponse: responseText };
    }

    if (response.ok) {
      console.log('Commande envoyée avec succès à ZR Express');
      return new Response(
        JSON.stringify({ 
          success: true, 
          orderNumber: orderData.orderNumber,
          zrResponse: responseData 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      console.error('Erreur lors de l\'envoi à ZR Express:', responseData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erreur lors de l\'envoi à ZR Express', 
          details: responseData,
          status: response.status
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error: any) {
    console.error('Erreur dans send-to-zr-express:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erreur interne du serveur', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);