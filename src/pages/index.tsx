import Head from 'next/head';
import { Autocomplete, Avatar, Box, Card, CardActions, CardContent, Grid, Rating, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';

// import { parseCookies } from 'nookies';
import { GetServerSideProps } from 'next';
import { api } from '@/services/api/api';

import { LuBeef } from "react-icons/lu";
import { GiDogHouse } from "react-icons/gi";
import { FaDog } from "react-icons/fa";

type Props = {
  id: number,
  nome: string
}

type Servicos = 'A' | 'H' | 'P'

type PetSitter = {
  id: number,
  nome: string,
  membroDesde: Date,
  servicos: Servicos[]
}

type Paginado<T> = {

  totalLinhas: number,
  pagina: number,
  data: T[]
}
export default function Home({ estados }: { estados: Props[] }) {
  const theme = useTheme()
  const [idEstado, setIdEstado] = useState<number>()
  const [cidades, setCidades] = useState<Props[]>([])
  const [idCidade, setIdCidade] = useState<number[] | undefined>()
  const [petSitters, setPetSiters] = useState<Paginado<PetSitter>>()
  const [tipoServico, setTipoServico] = useState<Servicos[]>()
  const [numeroPagina, setNumeroPagina] = useState<number>(1)

  useEffect(() => {
    async function getCidades(estado: number) {
      const { data } = await api.get<Props[]>(`/localizacao/cidade/${estado}`)
      setCidades(data)
    }
    if (idEstado)
      getCidades(idEstado)
  }, [idEstado])

  useEffect(() => {
    async function listaPetSitters(estado: number, cidade?: number[]) {
      let url = `/pet-sitter/encontrar?numeroPagina=${numeroPagina}&idEstado=${estado}`
      if (cidade) {
        url += `&idCidade=${cidade.join(',')}`
      }
      if (tipoServico?.length) {
        url += `&servicos=${tipoServico.join(',')}`
      }
      const { data } = await api.get<Paginado<PetSitter>>(url)
      setPetSiters(data)
    }
    if (idEstado)
      listaPetSitters(idEstado, idCidade)
  }, [idEstado, idCidade, tipoServico])

  return (
    <>
      <Head>
        <title>Encontre um Pet Sitter</title>
      </Head>
      <Box>
        <Typography variant="h4" align='center'>
          Encontre um Pet Sitter
        </Typography>
        <Box display={'flex'} justifyContent={'center'}>
          <Grid container spacing={1} sx={{ marginTop: theme.spacing(1), maxWidth: 225 * 3 }}>
            <Grid item xs={12} lg={4}>
              <Estado data={estados} onChange={(id: number) =>
                setIdEstado(id)
              } />
            </Grid>
            {
              cidades.length ? <Grid item xs={12} lg={4}>
                <Cidade data={cidades} onChange={(id?: number[]) =>
                  setIdCidade(id)
                } />
              </Grid> : null
            }
            {idEstado ?
              <Grid item xs={12} lg={4}>
                <ServicoFiltro onChange={(tipoServico: Servicos[]) => setTipoServico(tipoServico)} />
              </Grid> : null}

          </Grid>
        </Box>

        {petSitters?.totalLinhas ?
          <Typography variant="body2" align='center' sx={{ marginTop: theme.spacing(1) }}>
            {`${petSitters.totalLinhas} Pet Sitter(s) encontrado(s)!`}
          </Typography> : null}

        <Grid container spacing={1} sx={{ marginTop: theme.spacing(1) }}>
          {petSitters?.data.map((petSitter) => {
            return (<Grid item xs={12} sm={6} lg={3} key={petSitter.id}>
              <Card sx={{ minWidth: 280 }}>
                <CardContent>
                  <Grid container spacing={1} >
                    <Grid item xs={2} display={'flex'} alignItems={`center`}>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main }} aria-label="recipe">
                        {petSitter.nome[0].toUpperCase()}
                      </Avatar>
                    </Grid>
                    <Grid item xs={7} display={'flex'} flexDirection={`column`}>
                      <Typography variant="subtitle1" align='left'>
                        {petSitter.nome}
                      </Typography>
                      <Typography variant="subtitle2" align='left' color={theme.palette.text.secondary}>
                        Entrou em {new Date(petSitter.membroDesde).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} display={'flex'} justifyContent={'flex-end'}>
                      <Rating
                        name="simple-controlled"
                        value={5}
                        readOnly
                        size='small'
                        max={3}
                      />
                    </Grid>
                  </Grid>
                </CardContent>

                <CardActions disableSpacing>
                  <Grid container justifyContent={'center'} >
                    {petSitter.servicos.map((servico, i) => {

                      return <Grid item key={i} xs={4} textAlign={'center'}>
                        <Servico servico={servico} />
                      </Grid>
                    })}

                  </Grid>
                </CardActions>
              </Card>
            </Grid>)
          })}
        </Grid>

      </Box >
    </>
  );
}

function Servico({ servico }: { servico: Servicos }) {

  const theme = useTheme()

  if (servico === 'H') {
    return (
      <Tooltip title='Hospedagem'>
        <span>
          <GiDogHouse size={24} style={{ color: theme.palette.primary.main }} />
        </span>
      </Tooltip>)
  }

  if (servico === 'A') {
    return (
      <Tooltip title='Alimentação'>
        <span>
          <LuBeef size={24} style={{ color: theme.palette.primary.main }} />
        </span>
      </Tooltip>
    )
  }

  return (
    <Tooltip title='Passeio'>
      <span>
        <FaDog size={24} style={{ color: theme.palette.primary.main }} />
      </span>
    </Tooltip>
  )
}

function Estado({ data, onChange }: { data: Props[], onChange: (value: number) => void }) {
  return (
    <Stack sx={{ minWidth: 220 }}>
      <Autocomplete
        id="estado"
        isOptionEqualToValue={(option, value) =>
          option.id === value.id && option.nome === value.nome
        }
        disableClearable
        size='small'
        getOptionLabel={(e) => e.nome}
        options={data}
        onChange={(_event, value) => {
          onChange(value.id)
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selecione seu Estado"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
    </Stack>
  );
}

function Cidade({ data, onChange }: { data: Props[], onChange: (value?: number[]) => void }) {
  return (
    <Stack sx={{ minWidth: 220 }}>
      <Autocomplete
        id="cidade"
        multiple
        isOptionEqualToValue={(option, value) =>
          option.id === value.id && option.nome === value.nome
        }
        size='small'
        getOptionLabel={(e) => e.nome}
        options={data}
        onChange={(_event, value) => {
          onChange(value?.map(e => e.id))
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selecione sua Cidade"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
    </Stack>
  );
}

function ServicoFiltro({ onChange }: { onChange: (value: Servicos[]) => void }) {
  return (
    <Stack sx={{ minWidth: 220 }}>
      <Autocomplete
        id="cidade"
        size='small'
        multiple
        isOptionEqualToValue={(option, value) =>
          option.tipo === value.tipo && option.nome === value.nome
        }
        getOptionLabel={(e) => e.nome}
        options={[{
          tipo: 'A',
          nome: 'Alimentacao'
        },
        {
          tipo: 'P',
          nome: 'Passeio'
        },
        {
          tipo: 'H',
          nome: 'Hospedagem'
        }] as { tipo: Servicos, nome: string }[]}
        onChange={(_event, value) => {
          onChange(value.map(e => e.tipo))
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selecione o(s) Servico(s)"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}

          />
        )}
      />
    </Stack>
  );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // const { ['nextauth.token']: token } = parseCookies(ctx);

  // if (!token) {
  //   return {
  //     redirect: {
  //       destination: '/signin',
  //       permanent: false,
  //     },
  //   };
  // }

  const { data } = await api.get<Props[]>(`/localizacao/estado/1`);

  return {
    props: {
      estados: data
    },
  };
};
