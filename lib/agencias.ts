// Configuração das agências por executivo - Regional Completa
// Estrutura: { codigo, nome, porte?, gerentePJ? }

export interface Agencia {
  codigo: string
  nome: string
  porte?: string
  gerentesPJ?: string[] // Array para múltiplos gerentes PJ
}

export const agenciasPorExecutivo: Record<string, Agencia[]> = {
  // EQUIPE KESIA WEIGE NANDI
  'Dionei': [
    { codigo: '1775', nome: 'Farroupilha', porte: 'Grande', gerentesPJ: ['MATHEUS GALLIO CERON', 'BRUNA PEGORARO'] },
    { codigo: '2869', nome: 'Rua Marques Herval_Ucs', porte: 'Médio', gerentesPJ: ['RAFAEL BINOTTI', 'ADRIANO PEDRO TOSS'] },
    { codigo: '2176', nome: 'Pio X', porte: 'Grande' },
    { codigo: '2162', nome: 'Flores da Cunha', porte: 'Médio', gerentesPJ: ['JUSCELAINE BAGGIO PADILHA'] },
    { codigo: '269', nome: 'Caxias Do Sul_Cto', porte: 'Mega', gerentesPJ: ['FRANCIELE ARCARO NAZARIO', 'GABRIEL MULLER MARTINS', 'NATHAN SCHROEDER', 'MORGANA ZATTERA'] },
    { codigo: '1619', nome: 'S.Marcos', porte: 'Pequeno', gerentesPJ: ['RAFAELA DENISE MOREIRA'] },
    { codigo: '1778', nome: 'Torres', porte: 'Médio', gerentesPJ: ['MARCELO DE MATOS CARNEIRO'] }
  ],
  'Sheila': [],
  'Jeferson': [],
  'Jhonattan': [],
  'Renan': [],
  'Cristian': [
    { codigo: '3159', nome: 'Uruguaiana', porte: 'Grande', gerentesPJ: ['ERICSON FERNANDES', 'MAURICIO ROLDEN ESTEVEZ'] },
    { codigo: '1635', nome: 'Dom Pedrito', porte: 'Pequeno', gerentesPJ: ['ROBERTO CARLOS RUOSO'] },
    { codigo: '1306', nome: 'Rosário do Sul', porte: 'Pequeno', gerentesPJ: ['JOAO PAULO PEREIRA'] },
    { codigo: '1649', nome: 'Santiago', porte: 'Pequeno', gerentesPJ: ['JOSE ANTONIO DE PAULA'] },
    { codigo: '3278', nome: 'São Borja', porte: 'Médio', gerentesPJ: ['ALESSANDRO LEONELLI DE SOUZA', 'MARCOS PAULO DE OLIVEIRA'] },
    { codigo: '3268', nome: 'Alegrete', porte: 'Grande', gerentesPJ: ['KAREN FLORIANO', 'NATHALIE LUZ COSTA'] },
    { codigo: '3157', nome: 'Santana do Livramento', porte: 'Médio', gerentesPJ: ['JOEL MARTINS PEDROSO'] },
    { codigo: '0439', nome: 'Bagé', porte: 'Mega', gerentesPJ: ['CAROLINA BRUM BARBOZA', 'FLORIANO RODRIGUES DA SILVA JR', 'FLAVIA PINO CORA', 'GABRIEL VASCONCELOS'] },
    { codigo: '3279', nome: 'São Gabriel', porte: 'Pequeno' },
    { codigo: '1533', nome: 'S. Sepé', porte: 'Pequeno' }
  ],

  // EQUIPE AMANDA ALINE TRINDADE JUSTI
  'Vitor Hugo': [
    { codigo: '1588', nome: 'Sto.Antonio Platina', porte: 'Médio', gerentesPJ: ['ROGERS ALAN FERREIRA', 'LYGIA MARCELINO RODRIGUES DE LIMA'] },
    { codigo: '6697', nome: 'Siqueira Campos', porte: 'Médio', gerentesPJ: ['JOAO ANTONIO DIAS'] },
    { codigo: '969', nome: 'Ibaiti', porte: 'Médio', gerentesPJ: ['LUIZ FERNANDO DE SOUZA'] },
    { codigo: '1559', nome: 'Andira', porte: 'Médio', gerentesPJ: ['GUSTAVO DIAS SANTOS'] },
    { codigo: '71', nome: 'Bandeirantes', porte: 'Médio', gerentesPJ: ['GUSTAVO JUSTINO FERRARI'] },
    { codigo: '941', nome: 'Av. Tiradentes_Ulond', porte: 'Grande', gerentesPJ: ['ANA MARIA FERNANDES EVANGELISTA', 'MARCOS AURELIO SERVANTES JESUS', 'DIEGO HENRIQUE MORAES'] },
    { codigo: '51', nome: 'Cornelio Procopio', porte: 'Grande', gerentesPJ: ['JESSICA GOMES PINA HADDAD MANFIO', 'ALISSON MATHEUS DAMACENO'] },
    { codigo: '5672', nome: 'Arapoti', porte: 'Médio', gerentesPJ: ['LUIS FELIPE URBANOVICZ'] },
    { codigo: '1578', nome: 'Jacarezinho', porte: 'Pequeno', gerentesPJ: ['MARCELO ROBERTO CARDOSO DO CARMO'] },
    { codigo: '6269', nome: 'Joaquim Tavora', porte: 'Médio', gerentesPJ: ['DAIANY SPINA DOMINGUES'] },
    { codigo: '57', nome: 'Assai', porte: 'Médio', gerentesPJ: ['MATHEUS HENRIQUE ZANETTI'] }
  ],
  'Wagner': [
    { codigo: '32', nome: 'Rolandia', porte: 'Médio', gerentesPJ: ['VANESSA APARECIDA KAUFMANN', 'ELZIANI APARECIDA BERALDO'] },
    { codigo: '52', nome: 'Arapongas_Cto', porte: 'Grande', gerentesPJ: ['VIVIANE CRISTINE GRECCO MACHADO', 'FLAVIO LUIS HAYASHI', 'DANIEL GONCALVES FONCATTI'] },
    { codigo: '923', nome: 'Telemaco Borba', porte: 'Mega', gerentesPJ: ['FELIPE ELAN PRADO', 'RENAN CAMARGO KANZLER', 'GEISIELE MARI DE MELO MACHADO'] },
    { codigo: '871', nome: 'Maua Da Serra', porte: 'Pequeno', gerentesPJ: ['VANESSA CRISTINA GONZALES FATINANSI'] },
    { codigo: '47', nome: 'Apucarana_Cto', porte: 'Grande', gerentesPJ: ['FELIPE CAMPANA MAIOLI GARCIA', 'HENRIQUE MANTOVANI', 'RODRIGO FENATO'] },
    { codigo: '27', nome: 'Cambe_Cto', porte: 'Grande', gerentesPJ: ['VILMA RENATA CAMPAGNOLI SELLA'] },
    { codigo: '1498', nome: 'Ivaipora', porte: 'Pequeno' },
    { codigo: '6016', nome: 'Faxinal', porte: 'Pequeno' }
  ],
  'Patricia': [
    { codigo: '53', nome: 'Pc.W.Davids_Ulondr', porte: 'Grande', gerentesPJ: ['KELY KARINA TOLOVI ALTAFIN', 'JOAO FELIPE DA COSTA CARVALHO', 'LUCAS EMANUEL DOS SANTOS RODRIGUES', 'NATALIA MENDONCA VASCONCELOS VERONEZ'] },
    { codigo: '560', nome: 'Londrina_Cto', porte: 'Grande', gerentesPJ: ['LAURYANE APARECIDA DIAS DA SILVA', 'RENATO CEZAR BALESTRI', 'LUCIANE FEIJO SOARES IKEDA', 'AYMEE PARIETTI RAMOS ROMEIRO', 'LEANDRO CASTOLDI'] },
    { codigo: '141', nome: 'Ibipora', porte: 'Médio', gerentesPJ: ['CAMILA DE SOUSA SORGE DE ANGELI', 'PEDRO HENRIQUE FARIAS LIMA'] },
    { codigo: '1581', nome: 'Porecatu', porte: 'Pequeno', gerentesPJ: ['LEONARDO RAMOS OTAVIANO'] },
    { codigo: '50', nome: 'Sertanopolis', porte: 'Médio', gerentesPJ: ['WILLIAM DONIZETTI VIOTTO'] },
    { codigo: '6239', nome: 'Lago Parque_Ulond', porte: 'Médio', gerentesPJ: ['KARINE MARIA PAUCIC MOREIRA'] },
    { codigo: '147', nome: 'Bela Vista Paraiso', porte: 'Pequeno', gerentesPJ: ['RENATA BUAROLLI TOREZAN'] },
    { codigo: '778', nome: 'Cinco Cjtos_Ulondrin', porte: 'Pequeno', gerentesPJ: ['LIZ CAROLINE TARDIN GODOY DE ALMEIDA'] }
  ],
  'Augusto': [
    { codigo: '69', nome: 'Maringa_Cto', porte: 'Mega', gerentesPJ: ['MONICA DE SOUZA FRAIRE', 'HILDA CHRISTINA RIBEIRO', 'ANGELICA COLARES MANGOLIN DA CUNHA', 'NAIARA TARITA DA SILVA BORNIA', 'CAIO LEONARDO DE OLIVEIRA PEDROSO', 'JESSICA BENTO DE PAULA', 'RICARDO GOTARDO DE OLIVEIRA', 'MARCIO ROGERIO SOARES INOUE', 'LUAN FELIPE SARAPIAO'] },
    { codigo: '182', nome: 'Colorado', porte: 'Médio' },
    { codigo: '6254', nome: 'Mandaguari', porte: 'Médio', gerentesPJ: ['HUDSON GABRIEL GONCALVES'] },
    { codigo: '1921', nome: 'Engenheiro Beltrao', porte: 'Médio', gerentesPJ: ['RENATO ROZEIRA'] },
    { codigo: '1881', nome: 'Sarandi', porte: 'Médio', gerentesPJ: ['LUANA RODRIGUES SOPPA', 'MARIA FERNANDA GOMES DE MENEZES'] },
    { codigo: '6455', nome: 'Paicandu', porte: 'Pequeno', gerentesPJ: ['PAULA JULIANA RODRIGUES PINA CARDIN'] },
    { codigo: '68', nome: 'Jandaia Do Sul', porte: 'Médio', gerentesPJ: ['EDUARDA MARIA GONCALVES VIANNA'] },
    { codigo: '59', nome: 'Marialva', porte: 'Médio', gerentesPJ: ['NATALIA CAROLINE ANOTTI SILVA'] },
    { codigo: '161', nome: 'Itambe', porte: 'Médio' }
  ],
  'Tiago': [
    { codigo: '5001', nome: 'Agência Tiago 1', porte: 'Médio' },
    { codigo: '5002', nome: 'Agência Tiago 2', porte: 'Médio' },
    { codigo: '5003', nome: 'Agência Tiago 3', porte: 'Médio' }
  ],
  'Ana C Silva': [
    { codigo: '123', nome: 'Nova Esperanca' },
    { codigo: '3294', nome: 'Jd.Alvorada_Umaringa' },
    { codigo: '2460', nome: 'Pc.31 De Marco_Umga' },
    { codigo: '83', nome: 'Paranavai' },
    { codigo: '968', nome: 'Sta Isabel Do Ivai' },
    { codigo: '116', nome: 'Mandaguacu' },
    { codigo: '6333', nome: 'Paranacity' },
    { codigo: '2290', nome: 'Nova Londrina' },
    { codigo: '209', nome: 'Icaraima' },
    { codigo: '89', nome: 'Astorga' }
  ],
  'Abner': [
    { codigo: '142', nome: 'Cianorte', porte: 'Grande', gerentesPJ: ['JOSEPH CARLOS OLIVEIRA CONCEICAO', 'RODRIGO RODRIGUES SHIGUEMOTO'] },
    { codigo: '180', nome: 'Umuarama_Cto', porte: 'Mega', gerentesPJ: ['JHONATAN FELIPE DA SILVA', 'FLAVIA ANDREA PETROLINI FORTE MORI', 'GABRIELA FRASQUETTI BECCARI FACHIN', 'DOUGLAS HENRIQUE VIGO CRIVELARO', 'ERICA SIMONE DE OLIVEIRA', 'RAFAEL NASCE CALDERON'] },
    { codigo: '179', nome: 'Campo Mourao_Cto', porte: 'Grande', gerentesPJ: ['FLAVIA PANIZZON ESTELLAI', 'ROBERTA TOLONI COSTA RIBEIRO', 'DAELI CAVALCANTE DE OLIVEIRA'] },
    { codigo: '5815', nome: 'Araruna', porte: 'Pequeno', gerentesPJ: ['EMERSON TOMAZI'] },
    { codigo: '202', nome: 'Goioere', porte: 'Médio', gerentesPJ: ['IAM DE ANDRADE ISMAIL'] },
    { codigo: '181', nome: 'Terra Boa', porte: 'Médio', gerentesPJ: ['ALISSON HENRIQUE DE PIERRI'] },
    { codigo: '2479', nome: 'Tapejara', porte: 'Pequeno', gerentesPJ: ['HELLEN KAROLINE GUILHERME VIDAL'] },
    { codigo: '1641', nome: 'Loanda', porte: 'Médio', gerentesPJ: ['VANESSA GUERMANDI SARAIVA'] },
    { codigo: '1490', nome: 'Altonia', porte: 'Pequeno', gerentesPJ: ['ALICE CORNICELLI BIDOIA'] },
    { codigo: '6211', nome: 'Douradina Do Parana', porte: 'Pequeno', gerentesPJ: ['HENRIQUE TIAGO CHERON DA SILVA'] }
  ],

  // EQUIPE ADRIANO CORREA GOMES
  'Tba Exe 1 - Cascavel': [],
  'Vander': [
    { codigo: '3187', nome: 'Foz Do Iguacu_Centro' },
    { codigo: '1987', nome: 'Nova Cascavel_Ucvel' },
    { codigo: '1468', nome: 'Medianeira' },
    { codigo: '1179', nome: 'Pte Amizade_Ufozig' },
    { codigo: '617', nome: 'S.Miguel Do Iguacu' }
  ],
  'In Koo': [
    { codigo: '6488', nome: 'Quedas Do Iguacu' },
    { codigo: '1467', nome: 'Francisco Beltrao' },
    { codigo: '3283', nome: 'Pato Branco' },
    { codigo: '6006', nome: 'R.Sete Setembro_Udvi' },
    { codigo: '5820', nome: 'Capitao L.Marques' },
    { codigo: '5867', nome: 'Tres B.Do Parana' },
    { codigo: '5854', nome: 'Rio Bonito Do Iguacu' },
    { codigo: '5852', nome: 'Realeza' },
    { codigo: '5706', nome: 'Chopinzinho' }
  ],
  'Fabio': [
    { codigo: '6750', nome: 'Uniao Da Vitoria' },
    { codigo: '429', nome: 'Palmas' },
    { codigo: '6439', nome: 'Pitanga' },
    { codigo: '424', nome: 'Guarapuava_Cto' },
    { codigo: '6053', nome: 'Candoi' },
    { codigo: '1639', nome: 'Laranjeiras Do Sul' },
    { codigo: '945', nome: 'Turvo' },
    { codigo: '6465', nome: 'Prudentopolis' }
  ],
  'Henrique': [
    { codigo: '343', nome: 'Chapeco_Cto' },
    { codigo: '584', nome: 'B.S.Cristovao_Uchap.' },
    { codigo: '376', nome: 'S.Miguel Do Oeste' },
    { codigo: '7275', nome: 'S. Lourenco Do Oeste' },
    { codigo: '5955', nome: 'Campo Ere' },
    { codigo: '1555', nome: 'S.Carlos' },
    { codigo: '1209', nome: 'Pinhalzinho' },
    { codigo: '1010', nome: 'Ipora Do Oeste' },
    { codigo: '1731', nome: 'Maravilha' }
  ],
  'Paulo': [
    { codigo: '357', nome: 'Joacaba' },
    { codigo: '344', nome: 'Concordia' },
    { codigo: '385', nome: 'Xanxere' },
    { codigo: '1733', nome: 'Xaxim' },
    { codigo: '384', nome: 'Videira' },
    { codigo: '342', nome: 'Capinzal' },
    { codigo: '1735', nome: 'Tangara' }
  ],
  'Carlos': [
    { codigo: '346', nome: 'Curitibanos' },
    { codigo: '360', nome: 'Lages_Cto' },
    { codigo: '378', nome: 'Taio' },
    { codigo: '1736', nome: 'Fraiburgo' },
    { codigo: '338', nome: 'Cacador_Cto' },
    { codigo: '7267', nome: 'Otacilio Costa' },
    { codigo: '340', nome: 'Campos Novos' }
  ],

  // EQUIPE BRUNA PASSOS LEMES
  'Tba Exe 2 - Blumenau': [],
  'Raymi': [
      { codigo: '5750', nome: 'Avenida_Uctba' },
      { codigo: '5717', nome: 'Ahu_Urb.Curitiba' },
      { codigo: '3158', nome: 'Alto Maracana_Ucolom' },
      { codigo: '5760', nome: 'Bairro Merces_Uctba' }
    ],
    'William': [
      { codigo: '929', nome: 'Pinhais_Cto' },
      { codigo: '1197', nome: 'Bacacheri_Uctba' },
      { codigo: '1369', nome: 'Piraquara' },
      { codigo: '5693', nome: 'Campina Grande Sul' },
      { codigo: '6472', nome: 'Quatro Barras' },
      { codigo: '5718', nome: 'Rua Xv Novembro_Uctba' },
      { codigo: '5716', nome: 'B.Agua Verde_Uctba' }
    ],
    'Adler': [
      { codigo: '430', nome: 'Palmeira' },
      { codigo: '1553', nome: 'Castro' },
      { codigo: '6172', nome: 'Imbituva' },
      { codigo: '6453', nome: 'Avenida D.Pedro li_Upgros' },
      { codigo: '3881', nome: 'B.Oficinas_Upgrossa' },
      { codigo: '646', nome: 'Ponta Grossa_Cto' },
      { codigo: '6102', nome: 'Teixeira Soares' },
      { codigo: '1078', nome: 'Irati' }
    ],
    'Willyam': [
      { codigo: '5749', nome: 'R.M.V. Macedo_Uctba', porte: 'GRANDE' },
      { codigo: '5719', nome: 'B.Portao_Uctba', porte: 'MÉDIA' },
      { codigo: '5751', nome: 'B.Cajuru_Uctba', porte: 'PEQUENA' },
      { codigo: '5752', nome: 'B.Boqueirao_Uctba', porte: 'MÉDIA' },
      { codigo: '5753', nome: 'B.S.Francisco_Uctba', porte: 'GRANDE' },
      { codigo: '5754', nome: 'B.Centro_Uctba', porte: 'MEGA' },
      { codigo: '5755', nome: 'B.Agua Verde_Uctba', porte: 'PEQUENA' },
      { codigo: '5756', nome: 'B.Reboucas_Uctba', porte: 'MÉDIA' }
    ],
    'Alexsandro': [
      { codigo: '5757', nome: 'B.Pinheirinho_Uctba', porte: 'GRANDE' },
      { codigo: '5758', nome: 'B.S.Jose Pinhais_Uctba', porte: 'MÉDIA' },
      { codigo: '5759', nome: 'B.Fazenda Rio Grande_Uctba', porte: 'PEQUENA' },
      { codigo: '5761', nome: 'B.Campo Largo_Uctba', porte: 'MÉDIA' },
      { codigo: '5762', nome: 'B.Araucaria_Uctba', porte: 'GRANDE' },
      { codigo: '5763', nome: 'B.Colombo_Uctba', porte: 'MEGA' },
      { codigo: '5764', nome: 'B.Almirante Tamandare_Uctba', porte: 'PEQUENA' },
      { codigo: '5765', nome: 'B.Piraquara_Uctba', porte: 'MÉDIA' }
    ],
    'Cristian Alfonso': [
      { codigo: '5766', nome: 'B.Pinhais_Uctba', porte: 'GRANDE' },
      { codigo: '5767', nome: 'B.Campina Grande do Sul_Uctba', porte: 'MÉDIA' },
      { codigo: '5768', nome: 'B.Quatro Barras_Uctba', porte: 'PEQUENA' },
      { codigo: '5769', nome: 'B.Mandirituba_Uctba', porte: 'MÉDIA' },
      { codigo: '5770', nome: 'B.Contenda_Uctba', porte: 'GRANDE' },
      { codigo: '5771', nome: 'B.Rio Negro_Uctba', porte: 'MEGA' },
      { codigo: '5772', nome: 'B.Mafra_Uctba', porte: 'PEQUENA' },
      { codigo: '5773', nome: 'B.Campo do Tenente_Uctba', porte: 'MÉDIA' }
    ],
    'Kelvin': [
      { codigo: '5774', nome: 'B.Lapa_Uctba', porte: 'GRANDE' },
      { codigo: '5775', nome: 'B.Sao Mateus do Sul_Uctba', porte: 'MÉDIA' },
      { codigo: '5776', nome: 'B.Uniao da Vitoria_Uctba', porte: 'PEQUENA' },
      { codigo: '5777', nome: 'B.General Carneiro_Uctba', porte: 'MÉDIA' },
      { codigo: '5778', nome: 'B.Palmas_Uctba', porte: 'GRANDE' },
      { codigo: '5779', nome: 'B.Francisco Beltrao_Uctba', porte: 'MEGA' },
      { codigo: '5780', nome: 'B.Pato Branco_Uctba', porte: 'PEQUENA' },
      { codigo: '5781', nome: 'B.Dois Vizinhos_Uctba', porte: 'MÉDIA' }
    ],
    'Willian': [
      { codigo: '5782', nome: 'B.Realeza_Uctba', porte: 'GRANDE' },
      { codigo: '5783', nome: 'B.Capanema_Uctba', porte: 'MÉDIA' },
      { codigo: '5784', nome: 'B.Santo Antonio do Sudoeste_Uctba', porte: 'PEQUENA' },
      { codigo: '5785', nome: 'B.Barracao_Uctba', porte: 'MÉDIA' },
      { codigo: '5786', nome: 'B.Ampere_Uctba', porte: 'GRANDE' },
      { codigo: '5787', nome: 'B.Salto do Lontra_Uctba', porte: 'MEGA' },
      { codigo: '5788', nome: 'B.Santa Izabel do Oeste_Uctba', porte: 'PEQUENA' },
      { codigo: '5789', nome: 'B.Verê_Uctba', porte: 'MÉDIA' }
    ],

  // EQUIPE GUILHERME MORAES DORNEMANN
  'Tba Exe 2 - Porto_Alegre_Norte': [],
  'Ricardo': [
    { codigo: '1589', nome: 'Esteio' },
    { codigo: '1491', nome: 'Montenegro' },
    { codigo: '2270', nome: 'Pedro Adams Unhambur' },
    { codigo: '285', nome: 'S.Leopoldo_Cto' },
    { codigo: '1973', nome: 'Sapucaia Do Sul' },
    { codigo: '1926', nome: 'Estancia Velha' }
  ],
  'Paola': [
    { codigo: '3271', nome: 'Canoas Centro' },
    { codigo: '877', nome: 'Gravatai Cto' },
    { codigo: '7187', nome: 'Avenida D.C.L.Oliveira_Ug' },
    { codigo: '1604', nome: 'Cachoeirinha Cto' }
  ],
  'Josimar': [
    { codigo: '1925', nome: 'Campo Bom' },
    { codigo: '3152', nome: 'Novo Hamburgo_Cto' },
    { codigo: '1615', nome: 'Taquara' },
    { codigo: '1776', nome: 'Dois Irmaos' },
    { codigo: '1928', nome: 'Parobe' },
    { codigo: '1942', nome: 'Sapiranga' },
    { codigo: '1576', nome: 'Igrejinha' }
  ],
  'Edson': [
    { codigo: '3143', nome: 'Azenha_Upoa' },
    { codigo: '7210', nome: 'R.Olavo B.Viana_Upa' },
    { codigo: '268', nome: 'Porto Alegre_Cto' },
    { codigo: '558', nome: 'Moinhos Vento_Upa' },
    { codigo: '2468', nome: 'Cavalhada_Upa' },
    { codigo: '3145', nome: 'R.Siqueira Cpos_Upoa' },
    { codigo: '2964', nome: 'B.Ipanema_Upa' },
    { codigo: '3419', nome: 'Av.Wenceslau Esc_Upa' }
  ],
  'Fabiele': [
    { codigo: '326', nome: 'Passo D Areia_Upa' },
    { codigo: '2193', nome: 'Partenon_Upa' },
    { codigo: '1927', nome: 'Viamao Cto' },
    { codigo: '2276', nome: 'Carlos Gomes_Upa' },
    { codigo: '2907', nome: 'Alvorada' },
    { codigo: '1565', nome: 'Tres Figueiras_Upa' }
  ],
  'Sabrina': [
    { codigo: '387', nome: 'Pelotas Cto' },
    { codigo: '1980', nome: 'Camaqua' },
    { codigo: '412', nome: 'Rio Grande' },
    { codigo: '1000', nome: 'Chui' },
    { codigo: '2075', nome: 'Tres Vendas_Upelotas' },
    { codigo: '1557', nome: 'Cangucu' },
    { codigo: '1972', nome: 'Guaiba' }
  ],

  // EQUIPE TBA ESTADUAL BRA PARANA 2
  'Joslayne': [
    { codigo: '5750', nome: 'Avenida_Uctba' },
    { codigo: '5717', nome: 'Ahu_Urb.Curitiba' },
    { codigo: '3158', nome: 'Alto Maracana_Ucolom' },
    { codigo: '5760', nome: 'Bairro Merces_Uctba' }
  ],
  'Lyon': [
    { codigo: '929', nome: 'Pinhais_Cto' },
    { codigo: '1197', nome: 'Bacacheri_Uctba' },
    { codigo: '1369', nome: 'Piraquara' },
    { codigo: '5693', nome: 'Campina Grande Sul' },
    { codigo: '6472', nome: 'Quatro Barras' },
    { codigo: '5718', nome: 'Rua Xv Novembro_Uctba' },
    { codigo: '5716', nome: 'B.Agua Verde_Uctba' }
  ],
  'Elisandra': [
    { codigo: '430', nome: 'Palmeira' },
    { codigo: '1553', nome: 'Castro' },
    { codigo: '6172', nome: 'Imbituva' },
    { codigo: '6453', nome: 'Avenida D.Pedro li_Upgros' },
    { codigo: '3881', nome: 'B.Oficinas_Upgrossa' },
    { codigo: '646', nome: 'Ponta Grossa_Cto' },
    { codigo: '6102', nome: 'Teixeira Soares' },
    { codigo: '1078', nome: 'Irati' }
  ],
  'Lilian': [
    { codigo: '5749', nome: 'R.M.V. Macedo_Uctba' },
    { codigo: '49', nome: 'Curitiba_Cto' },
    { codigo: '2022', nome: 'Araucaria_Cto' },
    { codigo: '2471', nome: 'Avenida Brasilia_Uctba' },
    { codigo: '954', nome: 'Lapa' },
    { codigo: '1345', nome: 'Bair.Fazendinha_Ucur' },
    { codigo: '3993', nome: 'Sao Mateus Do Sul' }
  ],
  'Nicodemos': [
    { codigo: '926', nome: 'Colon.Murici_Usjpin' },
    { codigo: '2037', nome: 'V.Hauer_Uctba' },
    { codigo: '2995', nome: 'Boqueirao_Uctba' },
    { codigo: '6638', nome: 'Rua Xv Novembro_Usjpin' }
  ],
  'Tba Exe 1 - Curitiba_Norte': [
    { codigo: '1867', nome: 'Colombo_Cto' },
    { codigo: '1342', nome: 'Cto Civico_Uctba' },
    { codigo: '5727', nome: 'Bigorrilho_Uctba' },
    { codigo: '1205', nome: 'Almirante Tamandare' },
    { codigo: '6378', nome: 'Rio Branco Do Sul' }
  ],
  'Tba Exe 1 - Curitiba_Sul': [
    { codigo: '48', nome: 'Paranagua_Cto' },
    { codigo: '3287', nome: 'V.Parolin_Uctba' },
    { codigo: '2157', nome: 'Matinhos' },
    { codigo: '6011', nome: 'Guaratuba' },
    { codigo: '2810', nome: 'Jd.Das America_Uctba' },
    { codigo: '5755', nome: 'Rua Joao Negrao_Uctba' },
    { codigo: '6633', nome: 'B.Afonso Pena_Usjpin' }
  ],
  'Tba Exe 2 - Curitiba_Sul': [
    { codigo: '3286', nome: 'Portao-Uctba' },
    { codigo: '2994', nome: 'Ceasa_Uctba' },
    { codigo: '6105', nome: 'Tijucas Do Sul' },
    { codigo: '6151', nome: 'Mandirituba' },
    { codigo: '780', nome: 'Sitio Cercado_Uctba' },
    { codigo: '1219', nome: 'Pinheirinho_Uctba' },
    { codigo: '1711', nome: 'Fazenda Rio Grande' }
  ],
  'Tba Exe 4 - Curitiba_Norte': [
    { codigo: '1886', nome: 'Campo Largo' },
    { codigo: '2248', nome: 'S.Felicidade_Uctba' },
    { codigo: '2160', nome: 'Silva Jardim_Uctba' },
    { codigo: '2936', nome: 'S.Braz_Uctba' }
  ]
}

// Função para obter agências de um executivo específico
export function getAgenciasPorExecutivo(executivo: string) {
  return agenciasPorExecutivo[executivo as keyof typeof agenciasPorExecutivo] || []
}

// Função para obter todas as agências em formato de string para exibição
export function getAgenciasFormatadas(executivo: string) {
  const agencias = getAgenciasPorExecutivo(executivo)
  return agencias.map(ag => `${ag.codigo} - ${ag.nome}`)
}

// Lista de todos os executivos - Regional Completa
export const executivos = [
  // EQUIPE KESIA WEIGE NANDI
  'Sheila', 'Jeferson', 'Jhonattan', 'Renan', 'Dionei', 'Cristian',
  
  // EQUIPE AMANDA ALINE TRINDADE JUSTI
  'Vitor Hugo', 'Wagner', 'Patricia', 'Augusto', 'Tiago', 'Abner', 'Ana C Silva',
  
  // EQUIPE ADRIANO CORREA GOMES
  'Vander', 'In Koo', 'Fabio', 'Henrique', 'Paulo', 'Carlos', 'Tba Exe 1 - Cascavel',
  
  // EQUIPE BRUNA PASSOS LEMES
  'Raymi', 'William', 'Adler', 'Willyam', 'Alexsandro', 'Cristian Alfonso', 'Kelvin', 'Willian', 'Tba Exe 2 - Blumenau',
  
  // EQUIPE GUILHERME MORAES DORNEMANN
  'Ricardo', 'Paola', 'Josimar', 'Edson', 'Fabiele', 'Sabrina', 'Tba Exe 2 - Porto_Alegre_Norte',
  
  // EQUIPE TBA ESTADUAL BRA PARANA 2
  'Joslayne', 'Lyon', 'Elisandra', 'Lilian', 'Nicodemos', 
  'Tba Exe 1 - Curitiba_Norte', 'Tba Exe 1 - Curitiba_Sul', 
  'Tba Exe 2 - Curitiba_Sul', 'Tba Exe 4 - Curitiba_Norte'
]
