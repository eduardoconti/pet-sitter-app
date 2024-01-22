import Head from 'next/head';
import { Autocomplete, Avatar, Box, Card, CardActions, CardContent, Divider, Grid, Rating, Stack, TextField, Tooltip, TooltipProps, Typography, styled, tooltipClasses, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';

// import { parseCookies } from 'nookies';
import { GetServerSideProps } from 'next';
import { api } from '@/services/api/api';

import { LuBeef } from "react-icons/lu";
import { GiDogHouse } from "react-icons/gi";
import { FaDog } from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";

type Props = {
  id: number,
  nome: string
}

type Servicos = 'A' | 'H' | 'P' | 'L'

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
  const [idCidade, setIdCidade] = useState<number[]>([])
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

    setIdCidade([])
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
      <Box >
        <Typography variant="h6" align='center'>
          A Plataforma <b>Pet Sitters</b> é um local onde o Tutor pode encontrar alguém para cuidar de seu <b>Pet</b> em momentos de ausência.
        </Typography>
        <Typography variant="h6" align='center'>
          {`Os Pet sitters podem oferecer serviços de `}
          <MyTooltip title='O Pet sitter vai até a sua casa determinadas vezes alimentar o seu Pet.'>
            <span>
              <b>Alimentação</b>
              <LuBeef size={24} style={{ color: theme.palette.primary.main, marginLeft: theme.spacing(1) }} />
            </span>
          </MyTooltip>{`, `}
          <MyTooltip title='O Pet sitter tem um espaço reservado e apropriado para hospedar seu Pet.' >
            <span>
              <b>Hospedagem</b>
              <GiDogHouse size={24} style={{ color: theme.palette.primary.main, marginLeft: theme.spacing(1) }} />
            </span>
          </MyTooltip>{`, `}
          <MyTooltip title='O Pet sitter vai até a sua casa determinadas vezes fazer a limpeza do ambiente do seu Pet.'>
            <span>
              <b>Limpeza</b>
              <MdCleaningServices size={24} style={{ color: theme.palette.primary.main, marginLeft: theme.spacing(1) }} />
            </span>
          </MyTooltip>{` e `}
          <MyTooltip title='O Pet sitter passeia com seu Pet por um tempo determinado.'>
            <span>
              <b>Passeio</b>
              <FaDog size={24} style={{ color: theme.palette.primary.main, marginLeft: theme.spacing(1) }} />
              .
            </span>
          </MyTooltip>
        </Typography>
        <Typography variant="h3" align='center' color={theme.palette.secondary.main} sx={{ textShadow: '2px 2px 2px rgba(0, 0, 0, 1)', marginTop: theme.spacing(1) }}>
          {`Encontre um Pet Sitter!`.toUpperCase()}
        </Typography>
        <Box display={'flex'} justifyContent={'center'}>
          <Grid container spacing={1} sx={{ marginTop: theme.spacing(1), maxWidth: 225 * 3 }}>
            <Grid item xs={12} lg={4}>
              <EstadoFiltro data={estados} onChange={(id: number) =>
                setIdEstado(id)
              } />
            </Grid>
            {
              cidades.length ? <Grid item xs={12} lg={4}>
                <CidadeFiltro data={cidades} onChange={(id: number[]) =>
                  setIdCidade(id)
                } selectedItems={idCidade} />
              </Grid> : null
            }
            {idEstado ?
              <Grid item xs={12} lg={4}>
                <ServicoFiltro onChange={(tipoServico: Servicos[]) => setTipoServico(tipoServico)} />
              </Grid> : null}

          </Grid>
        </Box>

        <PetSitters petSitters={petSitters} idEstado={idEstado} />
      </Box >

    </>
  );
}


function PetSitters({ petSitters, idEstado }: { petSitters?: Paginado<PetSitter>, idEstado?: number }) {
  const theme = useTheme()

  function Texto() {
    if (idEstado) {
      return (
        petSitters?.totalLinhas ?
          <Typography variant="body2" align='center' sx={{ marginTop: theme.spacing(1) }}>
            {`${petSitters.totalLinhas} Pet Sitter(s) encontrado(s)!`}
          </Typography> : <Typography variant="h6" align='center' sx={{ marginTop: theme.spacing(1) }}>
            {`Nenhum Pet Sitter encontrado!`}
          </Typography>

      )
    } else {
      return <></>
    }
  }
  return (
    <>
      <Texto />
      <Grid container spacing={1} sx={{ marginTop: theme.spacing(1) }}>
        {petSitters?.data.map((petSitter) => {
          const rating = Math.floor(Math.random() * (3 / 0.25 + 1)) * 0.25
          return (
            <Grid item xs={12} md={6} lg={4} key={petSitter.id} >
              <Card >
                <CardContent>
                  <Grid container>
                    <Grid item xs={2} display={'flex'} justifyContent={'left'} >
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main }} aria-label="recipe">
                        {petSitter.nome[0].toUpperCase()}
                      </Avatar>
                    </Grid>
                    <Grid item xs={6} display={'flex'} flexDirection={`column`}>
                      <Typography variant="subtitle1" align='left'>
                        {petSitter.nome}
                      </Typography>
                      <Typography variant="subtitle2" align='left' color={theme.palette.text.secondary}>
                        Entrou em {new Date(petSitter.membroDesde).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Box display={'flex'} flexDirection={'column'}>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                          <Tooltip title={rating} placement='top' slotProps={{
                            popper: {
                              modifiers: [
                                {
                                  name: 'offset',
                                  options: {
                                    offset: [0, -18],
                                  },
                                },
                              ],
                            },
                          }}>
                            <span>
                              <Rating
                                name="simple-controlled"
                                value={rating}
                                readOnly
                                size='small'
                                precision={0.25}
                                max={3}
                              /></span>
                          </Tooltip>
                        </Box>
                        <Typography variant="subtitle2" align='right' color={theme.palette.text.secondary} >
                          {`${Math.floor(Math.random() * (200 - 10 + 1)) + 10} avaliações`}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>

                <Divider light >
                  <Typography color={theme.palette.text.secondary} >Serviços prestados</Typography>
                </Divider>

                <CardActions disableSpacing>
                  <Grid container justifyContent={'center'} >
                    {petSitter.servicos.map((servico, i) => {

                      return (
                        <Grid item key={i} xs={3} textAlign={'center'}>
                          <ServicosPrestados servico={servico} />
                        </Grid>)
                    })}

                  </Grid>
                </CardActions>
              </Card>
            </Grid>)
        })}
      </Grid>
    </>
  )
}

function ServicosPrestados({ servico }: { servico: Servicos }) {

  const theme = useTheme()

  if (servico === 'H') {
    return (
      <ServicosTooltip title='Hospedagem' >
        <span>
          <GiDogHouse size={24} style={{ color: theme.palette.primary.main }} />
        </span>
      </ServicosTooltip>)
  }

  if (servico === 'A') {
    return (
      <ServicosTooltip title='Alimentação'>
        <span>
          <LuBeef size={24} style={{ color: theme.palette.primary.main }} />
        </span>
      </ServicosTooltip>
    )
  }

  if (servico === 'L') {
    return (
      <ServicosTooltip title='Limpeza'>
        <span>
          <MdCleaningServices size={24} style={{ color: theme.palette.primary.main }} />
        </span>
      </ServicosTooltip>
    )
  }

  return (
    <ServicosTooltip title='Passeio'>
      <span>
        <FaDog size={24} style={{ color: theme.palette.primary.main }} />
      </span>
    </ServicosTooltip>
  )
}

function EstadoFiltro({ data, onChange }: { data: Props[], onChange: (value: number) => void }) {
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
            label="Estado"
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

function CidadeFiltro({ data, onChange, selectedItems }: { data: Props[], onChange: (value: number[]) => void, selectedItems: number[] }) {
  return (
    <Stack sx={{ minWidth: 220 }}>
      <Autocomplete
        id="cidade"
        multiple
        isOptionEqualToValue={(option, value) =>
          option.id === value.id && option.nome === value.nome
        }
        value={data.filter((item) => selectedItems.includes(item.id))}
        size='small'
        getOptionLabel={(e) => e.nome}
        options={data}
        onChange={(_event, value) => {
          onChange(value?.map(e => e.id))
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Cidade(s)"
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
          tipo: 'H',
          nome: 'Hospedagem'
        },
        {
          tipo: 'L',
          nome: 'Limpeza'
        },
        {
          tipo: 'P',
          nome: 'Passeio'
        },
        ] as { tipo: Servicos, nome: string }[]}
        onChange={(_event, value) => {
          onChange(value.map(e => e.tipo))
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Serviço(s)"
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

const MyTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.main,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const ServicosTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} slotProps={{
    popper: {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -12],
          },
        },
      ],
    },
  }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.light,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.light,
  },
}));

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
