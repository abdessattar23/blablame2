<?php

namespace App\Helpers;

use Exception;
use GuzzleHttp\Client;

class AIHelper
{
    public static function geminiCIN($imagePath)
    {
        $apiKey = "AIzaSyCCWmvYrcqCTGte8WzuZmlqv12erlO64QI";
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={$apiKey}";

        $client = new Client(['verify' => false]);
        $sys = "You are a Moroccan Identity card (CIN) validator. You will be provided a picture and your mission is detect if it is a real identity moroccan card or not, this is part of our platform validtion to recognize Moroccan CIN. you have to use the following template as your response: Respond with 'VALID' followed by a brief explanation if it's a real CIN, or 'INVALID' followed by a brief explanation if it's not. Do not use code blocks in your response. Example: 'VALID: The card layout matches official CIN design.' or 'INVALID: The card layout doesn't match official CIN design.'";
        $requestBody = [
            "contents" => [
                [
                    "parts" => [
                        ["text" => $sys]
                    ]
                ]
            ]
        ];

        if ($imagePath) {
            $imagePath = storage_path('app\\private\\documents\\' . basename($imagePath));
            $imageData = base64_encode(file_get_contents($imagePath));
            $requestBody["contents"][0]["parts"][] = [
                "inlineData" => [
                    "mimeType" => "image/jpeg",
                    "data" => $imageData
                ]
            ];
        }else{
            return -1;
        }



        try {
            $response = $client->post($url, [
                'json' => $requestBody
            ]);

            $decodedResponse = json_decode($response->getBody(), true);
            return $decodedResponse['candidates'][0]['content']['parts'][0]['text'];
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
