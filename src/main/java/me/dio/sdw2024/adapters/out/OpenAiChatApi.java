package me.dio.sdw2024.adapters.out;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.HttpHeaders;

import feign.FeignException;
import feign.RequestInterceptor;
import me.dio.sdw2024.domain.ports.GenerativeAiService;

@ConditionalOnProperty(name = "generative-ai.provider", havingValue = "OPENAI")
@FeignClient(name = "openaiAiApi", url = "${openai.base-url}")
public interface OpenAiChatApi extends GenerativeAiService{

    @PostMapping("/v1/chat/completions")
    OpenAiChatCompletionResp chatCompletion(OpenAiChatCompletionReq openAiChatCompletionReq);

    @Override
    default String generateContent(String objective, String context) {
        String model = "gpt-3.5-turbo";
        List<Menssage> messages = List.of(
            new Menssage("system", objective),
            new Menssage("user", context)
        );
        OpenAiChatCompletionReq req = new OpenAiChatCompletionReq(model, messages);
        try {
            OpenAiChatCompletionResp resp = chatCompletion(req);
            return resp.choices().getFirst().message().content();
        } catch (FeignException httpErrors) {
            return "Erro de comunicação com a API da OpenAI.";
        } catch (Exception unexpectedError) {
            return "O retorno da API da OpenAI não contem os dados esperados.";
        }
    }

    

    // Create chat completion
    // -d '{
    //     "model": "gpt-3.5-turbo",
    //     "messages": [
    //       {
    //         "role": "system",
    //         "content": "You are a helpful assistant."
    //       },
    //       {
    //         "role": "user",
    //         "content": "Hello!"
    //       }
    //     ]
    //   }'

    record OpenAiChatCompletionReq(String model, List<Menssage> messages) {}
    record Menssage(String role, String content) {}
    
    
    // {
    //     "choices": [{
    //       "index": 0,
    //       "message": {
    //         "role": "assistant",
    //         "content": "\n\nHello there, how may I assist you today?",
    //       }
    //     }]
    //   }

    record OpenAiChatCompletionResp(List<Choice> choices) {}
    record Choice(Menssage message) {}

    class Config {
        @Bean
        public RequestInterceptor apiKeyRequestInterceptor(@Value("${openai.api-key}") String apiKey) {
            return requestTemplate -> requestTemplate.header(
                    HttpHeaders.AUTHORIZATION, "Bearer %s".formatted(apiKey));
        }
    }
}
