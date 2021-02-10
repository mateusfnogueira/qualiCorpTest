<template>
  <v-row class="home flex-column align-center text-center" no-gutters>
    <div v-show="loading" class="load">
      <div class="spin"></div>
      <div class="loading">Carregando...</div>
    </div>
    <h3 v-if="stateForm">
      Informe nos por favor sua cidade e a sigla de seu estado e idade.
    </h3>
    <v-card v-if="stateForm" class="cardForm">
      <v-form class="form pa-6" ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="cidade"
          :rules="cidadeRules"
          label="Cidade"
          required
        ></v-text-field>

        <v-text-field
          v-model="estado"
          :rules="estadoRules"
          label="Estado(sigla)"
          required
        ></v-text-field>

        <input v-model="dataNascimento" type="date" required />

        <v-btn
          :disabled="!valid"
          color="success"
          class="ma-2 "
          @click="loadProfissao"
        >
          Coletar Dados
        </v-btn>

        <v-btn color="error" class="ma-2" @click="reset">
          Limpar Dados
        </v-btn>
      </v-form>
    </v-card>

    <h3 v-if="stateProfissao">
      Nos informe sua profissão para separarmos os melhores planos para o seu
      perfil
    </h3>
    <v-card v-if="stateProfissao" class="cardProfissao">
      <v-simple-table fixed-header height="700px" :key="prof.id">
        <template v-slot:default>
          <tbody>
            <tr v-for="prof in profissoes" :key="prof">
              <a @click="getEntidade(prof.profissao)">
                {{ prof.profissao }}
              </a>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <v-row
      v-if="statePlanos"
      class="justify-space-around ml-0 pa-10"
      no-gutters
    >
      <v-col
        sm="2"
        md="3"
        lg="4"
        cols="12"
        class="ma-2"
        v-for="plano in planos.planos"
        :key="plano"
        ><v-card class="cardPlanos" height="250px">
          <v-row class="d-flex justify-space-between" no-gutters>
            <v-img
              class="ml-2"
              :src="plano.operadoraLogo"
              max-width="100"
              min-height="40"
            ></v-img>
            <h2 class="mr-2 type">{{ plano.nivel }}</h2>
          </v-row>
          <v-row class="d-flex justify-center mt-0" no-gutters>
            <p>
              Nome:
              {{
                plano.nome_plano_ans
                  .toLowerCase()
                  .replace(/(?:^|\s)\S/g, function(a) {
                    return a.toUpperCase();
                  })
              }}
            </p>
          </v-row>
          <v-row class="d-flex justify-center mt-0" no-gutters>
            <p>
              Segmentação:
              {{
                plano.segmentacao
                  .toLowerCase()
                  .replace(/(?:^|\s)\S/g, function(a) {
                    return a.toUpperCase();
                  })
              }}
            </p>
          </v-row>
          <v-row class="d-flex justify-space-around mt-0" no-gutters>
            <p>
              Acomodação:
              {{
                plano.tipo_acomodacao
                  .toLowerCase()
                  .replace(/(?:^|\s)\S/g, function(a) {
                    return a.toUpperCase();
                  })
              }}
            </p>
            <p>R${{ plano.precos.total.replace('.', ',') }}</p>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    stateForm: true,
    statePlanos: false,
    stateProfissao: false,
    loading: false,
    cidade: '',
    cidadeRules: [(v) => !!v || 'Digite sua cidade.'],
    estado: '',
    estadoRules: [
      (v) => !!v || 'Digite o seu estado.',
      (v) => (v && v.length <= 2) || 'Coloque a sigla do eu estado.',
    ],
    dataNascimento: '',
    select: null,
    profissoes: [],
    prof: '',
    entidades: [],
    planos: [],
    plano: '',
  }),

  created() {},

  methods: {
    async loadProfissao() {
      this.validate();
      this.stateForm = false;
      this.loading = true;
      try {
        const resProfissoes = await this.$http.get(
          'profissao/SP/SÃO%20PAULO?api-key=ddd70c32-fc98-4618-b494-a9698f824353'
        );
        this.profissoes = resProfissoes.data;
        this.stateProfissao = true;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async getEntidade(value) {
      this.loading = true;
      this.stateProfissao = false;
      try {
        const respEntidade = await this.$http.get(
          `entidade/${value}/SP/S%C3%83O%20PAULO?api-key=4b94dba2-5524-4632-939b-92df1c50a645`
        );
        this.entidades = respEntidade.data;
        await this.getPlanos();
      } catch (error) {
        console.log(error);
      } finally {
        this.stateProfissao = false;
      }
    },

    async getPlanos() {
      const uriPalnos = `plano?api-key=261fd4d0-fd9f-468a-afa9-f5a89ed3701c`;
      for (let i = 0; i < this.entidades.length; i++) {
        await this.$http
          .post(uriPalnos, {
            entidade: this.entidades[i].NomeFantasia,
            uf: this.estado.toUpperCase(),
            cidade: this.cidade
              .toLowerCase()
              .replace(/(?:^|\s)\S/g, function(a) {
                return a.toUpperCase();
              }),
            datanascimento: [this.dataNascimento],
          })
          .then((resp) => {
            this.planos = resp.data;
          });
      }
      this.loading = false;
      this.statePlanos = !this.statePlanos;
    },

    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
      this.dataNascimento = '';
    },
  },
};
</script>

<style lang="scss">
.home {
  * {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      sans-serif;
  }

  .load {
    position: absolute;
    top: 30%;
    left: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    .spin {
      background: #00000020;
      height: 200px;
      width: 200px;
      border-radius: 50vh;
      border: 5px solid #00000000;
      border-top: 5px solid #fff;
      animation: loading 2s linear infinite;
    }
    .loading {
      position: absolute;
      color: #fff;
    }
  }

  h3 {
    font-style: italic;
    font-weight: 700;
    color: #ffffff;
  }

  .cardForm {
    width: 40%;
    .form {
      width: 100%;
    }
  }

  .cardProfissao {
    width: 30%;
  }

  .cardPlanos {
    width: 450px;
    p {
      font-size: 1rem;
    }
    .type {
      font-size: 1.6rem;
    }
  }
}



@media (min-width: 200px) and (max-width: 900px) {
    .home {
    .load {
      top: 20%;
      left: 30%;
    }

    .cardForm {
      width: 70%;
    }

    .cardProfissao {
      width: 60%;
    }

    .cardPlanos {
      width: 310px;
    }
  }
}

@keyframes loading {
  100% {
    transform: rotate(360deg);
  }
}
</style>
