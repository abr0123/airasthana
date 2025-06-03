import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import gpt2json from "../gpt2json";
interface RequestBody {
    data?: any[];
}

export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    try {
        // Parse and log the request body
        const reqBody: RequestBody = await request.json();
        context.log('Request body:', JSON.stringify(reqBody));

        // Check if data exists and is an array
        if (!reqBody.data || !Array.isArray(reqBody.data)) {
            throw new Error("Invalid request body: 'data' must be an array");
        }

        const promptType = request.query.get('prompt-type');
        const folderName = request.query.get('folder-name');

        context.log(`promptType: ${promptType}, folderName: ${folderName}`);

        // Call gpt2json function
        const result = await gpt2json(reqBody.data, promptType, folderName);
        context.log('gpt2json result:', JSON.stringify(result));

        // Prepare and return the response
        const responseBody = {
            inputData: reqBody.data,
            folderName,
            promptType,
            result
        };

        return { 
            body: JSON.stringify(responseBody),
            headers: {
                "Content-Type": "application/json"
            }
        };
    } catch (error) {
        context.error('Error in httpTrigger1:', error);
        return {
            status: 500,
            body: JSON.stringify({ error: error.message || "An unexpected error occurred" })
        };
    }
}

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTrigger1
});
