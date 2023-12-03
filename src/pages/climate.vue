<template>
  <div>
    <VRow>
      <template v-if="loading">
        <VOverlay
          :model-value="loading"
          class="align-center justify-center overlay-on-top"
        >
          <VProgressCircular
            color="primary"
            indeterminate
            size="32"
          />
        </VOverlay>
      </template>

       <!-- 👉 Snackbar -->
      <VSnackbar
        v-model="isOutlinedSnackbarVisible"
        location="top end"
        variant="flat"
        :color="snackbarColor"
      >
        {{ snackbarMessage }}
      </VSnackbar>

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
      loading: true,
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
      } as Weather,
      isOutlinedSnackbarVisible: false,
      snackbarMessage: '',
      snackbarColor: 'error',
    };
  },
  methods: {
    async getState(): Promise<selectWeatherProvince[]> {
      try {
        this.loading = true;
        const result = await axios.get('location/state');
    
        if (!result || !result.data) {
          return [] as selectWeatherProvince[];
        }

        this.loading = false;
    
        return result.data as selectWeatherProvince[];
      } catch (error) {
        this.showSnackbar('Erro ao listar estados');

        this.loading = false;

        return [] as selectWeatherProvince[];
      }
    },
    async getCity(idState: number): Promise<selectWeatherCity[]> {
      try {
        this.loading = true;

        const result = await axios.get(`location/state/${idState}`);
    
        if (!result || !result.data) {
          return [] as selectWeatherCity[];
        }

        this.loading = false;
    
        return result.data as selectWeatherCity[];
      } catch (error) {
        this.showSnackbar('Erro ao listar cidades');

        this.loading = false;

        return [] as selectWeatherCity[];
      }
    },
    async getWeatherCity(city: string): Promise<Weather> {
      try {
        this.loading = true;

        const result = await axios.post('weather/city', {
          city
        });
    
        if (!result || !result.data) {
          return {} as Weather;
        }

        this.loading = false;
    
        return result.data as Weather;
      } catch (error) {
        this.showSnackbar('Erro ao listar clima da cidade');

        this.loading = false;
        
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
    },
    showSnackbar(message: string, color: string = 'error') {
      this.isOutlinedSnackbarVisible = true;
      this.snackbarMessage = message;
      this.snackbarColor = color;
    },
  },
  async mounted() {
    this.province = await this.getState();
    this.city = await this.getCity(this.provinceSelected);
    await this.changeCity();
  }
});
</script>
