import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LocationRequest {
  wilaya: string;
  type: 'communes' | 'offices';
}

const handler = async (req: Request): Promise<Response> => {
  console.log('get-zr-locations: Nouvelle requête reçue', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TOKEN = Deno.env.get('ZR_EXPRESS_TOKEN');
    const KEY = Deno.env.get('ZR_EXPRESS_KEY');
    
    console.log('Vérification des credentials ZR Express:', { 
      hasToken: !!TOKEN, 
      hasKey: !!KEY 
    });
    
    if (!TOKEN || !KEY) {
      console.error('Missing ZR Express credentials');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Configuration manquante pour ZR Express',
          details: 'Les clés ZR_EXPRESS_TOKEN et ZR_EXPRESS_KEY doivent être configurées'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const requestBody = await req.json();
    console.log('Corps de la requête:', requestBody);
    
    const { wilaya, type }: LocationRequest = requestBody;
    
    if (!wilaya || !type) {
      console.error('Paramètres manquants:', { wilaya, type });
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Paramètres manquants',
          details: 'wilaya et type sont requis'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log(`Récupération des ${type} pour la wilaya: ${wilaya}`);

    let apiEndpoint: string;
    if (type === 'communes') {
      apiEndpoint = 'https://procolis.com/api_v2/get_communes';
    } else {
      apiEndpoint = 'https://procolis.com/api_v2/get_offices';
    }

    // Récupérer les données depuis l'API ZR Express
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': TOKEN,
        'key': KEY
      },
      body: JSON.stringify({ wilaya: wilaya })
    });

    const responseText = await response.text();
    console.log(`Réponse ZR Express pour ${type} (${response.status}):`, responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Réponse invalide de l\'API ZR Express',
          details: 'La réponse reçue n\'est pas au format JSON valide',
          rawText: responseText.substring(0, 200) // Limiter la taille
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (response.ok) {
      // Filtrer les données selon la wilaya demandée
      let locations = [];
      
      if (type === 'communes' && responseData.communes) {
        locations = responseData.communes.filter((commune: any) => 
          commune.wilaya?.toLowerCase() === wilaya.toLowerCase()
        );
      } else if (type === 'offices' && responseData.offices) {
        locations = responseData.offices.filter((office: any) => 
          office.wilaya?.toLowerCase() === wilaya.toLowerCase()
        );
      }

      console.log(`${locations.length} ${type} trouvé(e)s pour ${wilaya}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          wilaya,
          type,
          locations 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      console.error(`Erreur lors de la récupération des ${type}:`, responseData);
      
      // Extraire un message d'erreur utilisable
      let errorDetails = 'Service temporairement indisponible';
      if (responseData?.fault?.faultstring) {
        errorDetails = responseData.fault.faultstring;
      } else if (typeof responseData === 'string') {
        errorDetails = responseData;
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Erreur lors de la récupération des ${type}`, 
          details: errorDetails,
          status: response.status
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error: any) {
    console.error('Erreur dans get-zr-locations:', error);
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