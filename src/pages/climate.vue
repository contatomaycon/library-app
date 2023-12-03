<template>
  <div>
    <VRow>
      <VCol cols="6">
        <VCard>
          <VCardText class="d-flex justify-space-between">
            <VCol cols="6">
              <AppSelect
                :items="province"
                v-model="provinceSelected"
                @update:model-value="changeProvince"
                label="Estado"
                item-title="title"
                item-value="value"
              />
            </VCol>

            <VCol cols="6">
              <AppSelect
                :items="city"
                v-model="citySelected"
                @update:model-value="changeCity"
                label="Cidade"
                item-title="title"
                item-value="value"
              />
            </VCol>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="6">
        <VCard>
          <VCardText class="d-flex justify-space-between">
            <div>
              <h5 class="text-h5">{{ weatherData.city }}</h5>
              <div class="text-caption">{{ weatherData.time }}</div>
            </div>
            <div class="d-flex flex-column align-center">
              <VIcon 
                :icon="weatherData.icon" 
                size="30" 
                class="mb-1" 
              />
              <span class="text-h3 mb-1">{{ weatherData.temp }}°C</span>
              <div class="text-subtitle-2">{{ weatherData.description }}</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script lang="ts">
import { getWeatherIcon } from '@/common/getWeatherIcon';
import { defineComponent } from 'vue';
import axios from '@/plugins/axiosAuth';
import { selectWeatherProvince, selectWeatherCity } from '@/common/type/selectWeather';
import { Weather } from '@/common/type/Weather';

export default defineComponent({
  name: 'WeatherCard',
  data() {
    return {
      province: [] as selectWeatherProvince[],
      provinceSelected: 53,
      city: [] as selectWeatherCity[],
      citySelected: 'Brasília, DF' as string | null,
      weatherData: {
        temp: 0,
        time: '',
        condition_code: '',
        description: 'Sem estimativa de tempo',
        city: 'Brasília, DF',
        icon: 'mdi-help-circle-outline',
      } as Weather
    };
  },
  methods: {
    async getState(): Promise<selectWeatherProvince[]> {
      try {
        const result = await axios.get('location/state');
    
        if (!result || !result.data) {
          return [] as selectWeatherProvince[];
        }
    
        return result.data as selectWeatherProvince[];
      } catch (error) {
        console.error("Erro ao listar estados:", error);
        return [] as selectWeatherProvince[];
      }
    },
    async getCity(idState: number): Promise<selectWeatherCity[]> {
      try {
        const result = await axios.get(`location/state/${idState}`);
    
        if (!result || !result.data) {
          return [] as selectWeatherCity[];
        }
    
        return result.data as selectWeatherCity[];
      } catch (error) {
        console.error("Erro ao listar cidades:", error);
        return [] as selectWeatherCity[];
      }
    },
    async getWeatherCity(city: string): Promise<Weather> {
      try {
        const result = await axios.post('weather/city', {
          city
        });
    
        if (!result || !result.data) {
          return {} as Weather;
        }
    
        return result.data as Weather;
      } catch (error) {
        console.error("Erro ao listar cidades:", error);
        return {} as Weather;
      }
    },
    async changeProvince() {
      if (!this.provinceSelected) {
        return;
      }

      this.citySelected = null;
      this.city = await this.getCity(this.provinceSelected);
    },
    async changeCity() {
      if (!this.citySelected) {
        return;
      }

      this.weatherData = await this.getWeatherCity(this.citySelected);
      this.weatherData.icon = getWeatherIcon(Number(this.weatherData.condition_code));
    }
  },
  async mounted() {
    this.province = await this.getState();
    this.city = await this.getCity(this.provinceSelected);
    await this.changeCity();
  }
});
</script>
