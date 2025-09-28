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

    const { wilaya, type }: LocationRequest = await req.json();
    console.log(`Récupération des ${type} pour la wilaya: ${wilaya}`);

    let apiEndpoint: string;
    if (type === 'communes') {
      apiEndpoint = 'https://procolis.com/api_v1/get_communes';
    } else {
      apiEndpoint = 'https://procolis.com/api_v1/get_offices';
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
    } catch {
      responseData = { rawResponse: responseText };
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
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Erreur lors de la récupération des ${type}`, 
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