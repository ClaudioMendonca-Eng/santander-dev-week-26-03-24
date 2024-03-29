package me.dio.sdw2024.adapters.out;

import org.springframework.cloud.openfeign.FeignClient;

import me.dio.sdw2024.domain.ports.GenerativeAiApi;

@FeignClient(name = "openaiAiChatApi", url = "${openai.base-url}")
public interface OpenAiChatApi extends GenerativeAiApi{

    @Override
    default String generateContent(String objective, String context) {
        return null;
    }

}
