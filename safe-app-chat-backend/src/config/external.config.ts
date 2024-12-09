import { registerAs } from "@nestjs/config";

export default registerAs('external', () => ({
    aiServiceEndpoint: process.env.AI_SERVICE_ENDPOINT || '',
    aiServiceKey: process.env.AI_SERVICE_API_KEY || '',
}));