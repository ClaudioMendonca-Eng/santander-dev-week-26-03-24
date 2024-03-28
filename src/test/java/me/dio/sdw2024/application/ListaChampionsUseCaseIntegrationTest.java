package me.dio.sdw2024.application;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import me.dio.sdw2024.domain.model.Champion;

@SpringBootTest
public class ListaChampionsUseCaseIntegrationTest {

    @Autowired
    private ListChampionsUseCase listChampionsUseCase;
    @Test
    public void test() {
        List<Champion> champions = listChampionsUseCase.findAll();

        assertEquals(12, champions.size());
    }

}
