import axios from 'axios';
import * as dotenv from "dotenv";
import promptDetails from "./promptDetails";
import { fileUploader } from './fileUploader';
dotenv.config();

const API_URL = process.env.GPT_API_URL || ""

const systemMessages: { [key: string]: string } = {
    classification: "You are an expert assistant specialized in analyzing and classifying customer feedback into predefined categories as given by the user. You have to present key issues of the service offered by the airline in a comma separated manner in english so that they can improve their service",
    //classification: "You are an expert assistant specializing in analyzing and categorizing customer feedback for an airline into predefined categories provided by the user. Your primary tasks are: 1. Extract the key issues mentioned in the feedback and present them as a comma-separated list in English to help the airline improve its service. 2. Assign the feedback to one or more appropriate categories from the provided list. 3. If the feedback fits into multiple categories, return the categories as a comma-separated list. 4. If no feedback is provided, assign the category as NA. Answer in this format: Key issues: <issues here>\\n\\nClassified Category: <categories here>",
    sentiment: "Provide overall sentiment score between 0 to 5 for the review\n- Classify the following feedback into 1 of the following categories: Generic, In-Flight Experience, Post-Flight Experience, Pre-Flight Experience, Search & Booking Experience \n- Answer in the format \nSentiment Score:<Sentiment Score Here>\nCategory:<Category here>"
};

export default async function processEntry(element: any, promptType: string, fileName: string) {
    try {
        const promptDetail = promptDetails[promptType as keyof typeof promptDetails];
        if (!promptDetail) {
            throw new Error(`Invalid prompt type: ${promptType}`);
        }

        const systemMessage = systemMessages[promptType] || "You are a helpful assistant.";

        const requestBody = {
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": systemMessage
                },
                {
                    "role": "user",
                    "content": `${promptDetail.prompt} '${element.q4_1}'`
                }
            ],
            max_tokens: promptDetail.max_tokens,
            temperature: 0
        };

        let response = await axios.post(API_URL, requestBody, {
            headers: {
                'Authorization': `Bearer ${process.env.GPT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        let responseData = response.data;

        let enhancedResponse = {
            ...responseData,
            "Sl No": String(element.id)
        };

        //console.log(responseData);
        const newFileName = (new Date()).toISOString();
        await fileUploader(fileName, `${newFileName}.json`, JSON.stringify(enhancedResponse))

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error making API request:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }

        return error;
    }
    return 0;
}
