// Fichas de las 11 especies. Fuente: docs/fichas.md, docs/kit.md y docs/armados.md.
// Texto: "**negrita**" se muestra en negrita. Bloques: { p: 'párrafo' } | { list: ['ítem', ...] } | { h: 'subtítulo' } | { rigs: 'tararira' } (muestra los armados de línea de ese pez, solo en equipo de tararira, carpa y bagre).
export const SPECIES = [
  {
    id: 'tararira',
    name: 'Tararira',
    scientific: 'Hoplias malabaricus',
    scored: true,
    where: 'Laguna de Navarro',
    recognize: 'Cuerpo cilíndrico y robusto, pardo con manchas oscuras, boca grande con dientes filosos.',
    carnadas: [
      { list: [
        '**Principal:** mojarra viva, la más efectiva en laguna.',
        '**Alternativas:** corazón de vaca, pata de rana, lombriz grande, asado o corte de vaca. También filet de dientudo, bagre o carpa.',
      ] },
      { h: 'Señuelos del kit' },
      { list: [
        'Buceador rojo/amarillo con paleta: media agua, recogida lenta con pausas.',
        'Popper verde/amarillo: superficie, mañana y atardecer con agua tranquila.',
        'Curly tail root beer en jig: se trabaja desde el fondo; la mayoría pica en la caída.',
        'Gozio Lure: superficie y sobre estructuras, se engancha poco.',
        'Rana Caster Killer Frog: vegetación densa, donde los otros se enganchan.',
        'Gozio Falix: paseante soft, superficie en agua calma.',
        'X-fish Gill Pompaudor: superficie, zonas sin mucha vegetación.',
        'X-fish Wake Crank: superficie, para recorrer mucha agua y encontrar peces activos.',
      ] },
    ],
    habitat: [
      { list: [
        '**Dónde:** en el borde entre la vegetación (juncos, camalotes, plantas sumergidas) y el agua abierta, donde se embosca. Fondo de barro blando.',
        '**Profundidad:** agua baja con vegetación. Al mediodía baja al fondo buscando agua más fresca.',
        '**Horario:** amanecer, atardecer y noche. El mediodía es el peor momento.',
        '**Época:** de noviembre a marzo. En octubre y abril está menos activa; con el agua debajo de 14 °C se aletarga entre la vegetación.',
      ] },
    ],
    equipo: [
      { list: [
        '**Línea:** madre de nylon 0,30 mm (la del kit).',
        '**Líder:** alambre de acero (7x7 o mono-acero) de 20 a 30 cm. Siempre: si no, corta la línea con los dientes.',
        '**Anzuelo:** uno solo, 2/0 a 5/0 según el tamaño. Para gomas, el offset lastrado del kit (confirmar qué medida se compró: 3/0 3 g, 4/0 5 g o 4/0 7 g).',
        '**Armado recomendado:** boya corrediza o plop, para que la carnada quede sobre la vegetación sin engancharse.',
      ] },
      { rigs: 'tararira' },
    ],
    tips: [
      { list: [
        'Ataca emboscada desde la vegetación: tirar cerca de juncos y camalotes, no en el agua abierta.',
        'Con señuelos de goma, esperar un poco antes de clavar: no clavar apenas se siente el primer tirón. Con la rana, esperar 1 o 2 segundos.',
        'En primavera cuida el nido y ataca por irritación: puede pegarle a un señuelo aunque no tenga hambre.',
        'Color del señuelo: agua turbia, colores fuertes; agua clara, naturales; con sol, brillantes; nublado, oscuros.',
        'Sacar el anzuelo con el alicate: tiene dientes filosos.',
      ] },
    ],
    confidence: 'Alta: varias fuentes de pesca coinciden.',
    sources: [
      { title: 'Tararira — AIPeces', url: 'https://www.aipeces.com/blog/pesca-de-la-tararira' },
      { title: 'Tarariras con mosca — MSDB', url: 'https://msdb.com.ar/tararira.htm' },
      { title: 'Tararira — Sentí la Pesca', url: 'http://sentilapesca.com.ar/tararira-hoplias-malabaricus' },
      { title: 'Línea plop para tarariras — Sentí la Pesca', url: 'http://sentilapesca.com.ar/linea-plop-para-tarariras' },
      { title: 'Tarariras: dónde, cómo y con qué — Weekend', url: 'https://weekend.perfil.com/noticias/pesca/tarariras-donde-como-y-con-que-tentar-al-verdadero-pez-argentum.phtml' },
      { title: 'La pesca de tarariras — EsPesca', url: 'https://espesca.com/pesca-de-tarariras/' },
    ],
  },
  {
    id: 'carpa',
    name: 'Carpa',
    scientific: 'Cyprinus carpio',
    scored: true,
    where: 'Laguna de Navarro',
    recognize: 'Cuerpo alto con escamas grandes, boca chica con dos pares de barbillas.',
    carnadas: [
      { list: [
        '**Principal:** maíz dulce o papa hervida en cubos.',
        '**Alternativas:** pan remojado, lombriz con un diente de ajo, masa de harina (dulce y compacta). En ríos y arroyos bonaerenses también se usan chorizo colorado, salame y queso.',
      ] },
      { p: 'Señuelos: ninguno del kit. Si acaso, el curly tail de fondo con plomo.' },
    ],
    habitat: [
      { list: [
        '**Dónde:** agua tranquila con fondo barroso. Bordes con vegetación, orillas con caída suave y lugares donde se ven burbujas en la superficie (es la carpa revolviendo el fondo).',
        '**Profundidad:** siempre al fondo, de 0,5 a 3 m. En una laguna de 1 m de promedio sirve casi toda.',
        '**Horario:** amanecer y anochecer.',
        '**Época:** de noviembre a marzo. Con el agua debajo de 10 °C casi no come.',
      ] },
    ],
    equipo: [
      { list: [
        '**Línea:** madre de nylon 0,30 mm. Tu caña de 2,40 m y el reel 3000 son justo lo que se recomienda para empezar.',
        '**Brazolada:** fluorocarbono 0,30 a 0,35 mm.',
        '**Anzuelo:** número 6 a 4.',
        '**Plomada:** corrediza chica, lo justo para llegar adonde querés lanzar.',
        '**Armado recomendado:** fondo liviano corredizo. Todo está en el kit.',
      ] },
      { rigs: 'carpa' },
    ],
    tips: [
      { list: [
        'Pica suave: con plomada corrediza y brazolada larga no siente resistencia. Mirar la puntera.',
        'Buscar las burbujas en la superficie: es la carpa comiendo en el fondo.',
        'Con agua fría casi no come: la temporada es de noviembre a marzo.',
      ] },
    ],
    confidence: 'Alta.',
    sources: [
      { title: 'Cómo pescar carpa en Argentina — Pescabox', url: 'https://pescabox.com.ar/guias/carpa' },
      { title: 'La carpa común — CONICET', url: 'https://ri.conicet.gov.ar/bitstream/handle/11336/104245/CONICET_Digital_Nro.de3da557-4688-4c52-a9c6-3ddab7e994bc_A.pdf?sequence=2' },
      { title: 'Carpas del Totoral — Diana Outdoor', url: 'https://www.dianaoutdoor.com.ar/blogs/pesca/carpas-del-totoral/' },
    ],
  },
  {
    id: 'bagre',
    name: 'Bagre',
    scored: true,
    where: 'Laguna de Navarro',
    recognize: 'Piel lisa sin escamas, cabeza chata con bigotes largos.',
    carnadas: [
      { list: [
        '**Principal:** lombriz colorada, en racimo (varias juntas en el mismo anzuelo).',
        '**Alternativas:** hígado de pollo, embutido o fiambre, corazón de vaca, trozos de pescado.',
      ] },
      { p: 'Caza por olfato: cuanto más oloroso el cebo, mejor.' },
      { p: 'Señuelos: ninguno del kit. Si acaso, el curly tail de fondo con plomo.' },
    ],
    habitat: [
      { list: [
        '**Dónde:** agua poco profunda con vegetación y fondo barroso con hojas y restos de madera, donde se esconde de día.',
        '**Profundidad:** pegado al fondo.',
        '**Horario:** sobre todo de noche. De día pica más si el agua está turbia.',
        '**Época:** de septiembre a mayo. Con el agua fría deja de comer.',
      ] },
    ],
    equipo: [
      { list: [
        '**Línea:** madre de nylon 0,30 mm.',
        '**Brazolada:** fluorocarbono 0,30 a 0,35 mm, de unos 50 cm.',
        '**Anzuelo:** número 4 a 1, mejor circular (circle hook), de vástago grueso y abertura amplia.',
        '**Plomada:** corrediza de 20 a 40 g; en laguna sin corriente alcanza con la más liviana que te deje lanzar.',
        '**Armado recomendado:** fondo corredizo con un anzuelo. Todo está en el kit.',
      ] },
      { rigs: 'bagre' },
    ],
    tips: [
      { list: [
        'Se pesca de fondo y sobre todo de noche: el armado de un anzuelo se enreda poco en la oscuridad.',
        'Usar el cebo más oloroso que tengas: lo encuentra por el olfato.',
        'Con el agua fría deja de comer: la temporada es de septiembre a mayo.',
      ] },
    ],
    confidence: 'Media: los datos son del bagre sapo en general, no de lagunas de Navarro.',
    sources: [
      { title: 'Bagre sapo — SIB', url: 'https://sib.gob.ar/especies/rhamdia-sapo' },
      { title: 'Rhamdia quelen — Wikipedia', url: 'https://es.wikipedia.org/wiki/Rhamdia_quelen' },
      { title: 'Peces del Paraná: Rhamdia quelen — Primera Edición', url: 'https://www.primeraedicion.com.ar/nota/100915542/peces-del-rio-parana-rhamdia-quelen/' },
      { title: 'Aparejos — La pesca en Argentina', url: 'https://lapescaenargentina.blogspot.com/p/aparejos_4465.html' },
    ],
  },
  {
    id: 'pejerrey',
    name: 'Pejerrey',
    scientific: 'Odontesthes bonariensis',
    scored: false,
    where: 'Laguna de Navarro, laguna de Lobos, río Salado',
    recognize: 'Cuerpo alargado y plateado con una franja plateada brillante a lo largo del costado, dos aletas en el lomo, cola en horquilla y boca chica.',
    carnadas: [
      { list: [
        '1) Mojarra viva, la que más rinde.',
        '2) Filet de dientudo de la misma laguna.',
        '3) Filet de pejerrey.',
      ] },
      { p: '**Señuelos:** ninguno de los del kit (son para tararira). La cucharita giratoria chica del catálogo sirve.' },
      { p: '**Encarnar:** el filet colgado del anzuelo, para que se mueva y haga volumen.' },
    ],
    habitat: [
      { list: [
        '**Dónde:** anda en cardumen y hay que seguirlo. Con viento se afirma en el centro de la laguna.',
        '**Profundidad:** cambia según el día. Con heladas baja al fondo; en días templados sube.',
        '**Horario:** de día. En las lagunas de la provincia la pesca nocturna del pejerrey no está permitida (Disposición 19/96, según prensa: confirmar).',
        '**Época:** temporada fría, de abril a agosto. Del 1 de septiembre al 30 de noviembre hay veda.',
      ] },
    ],
    equipo: [
      { list: [
        '**Armado:** línea de 2 o 3 boyas (una de flote y otra que sostiene las brazoladas), con 2 o 3 brazoladas de 10 a 30 cm de distinto largo. Con viento, pasternóster.',
        '**Anzuelo:** 1/0, de alambre blando y bien filoso: el pejerrey tiene la boca blanda.',
        '**Del kit:** la línea de 0,30 mm sirve como línea madre. Faltan boyas y anzuelos de pejerrey.',
      ] },
    ],
    tips: [
      { list: [
        '**Cómo pica:** la boya se corre a un costado y después se hunde. Estudia la carnada antes de tomarla: no clavar al primer movimiento.',
        '**Boca blanda:** no forzar la clavada ni la pelea.',
        '**Reglas:** veda del 1 de septiembre al 30 de noviembre (Disposición 89/08); durante la veda solo sábados, domingos y feriados, respetando el cupo. Talla mínima 25 cm, medida de la punta de la boca cerrada al final de la cola (Disposición 19/96). Cupo de 15 por pescador por día en ríos, arroyos y canales y en la mayoría de las lagunas; algunas lagunas tienen cupo propio. Talla y cupo salen de prensa de 2026 que cita la norma: confirmar al empezar cada temporada.',
      ] },
    ],
    confidence: 'Alta en armado y carnadas; la veda es oficial. Talla mínima, cupo y pesca nocturna salen de prensa de 2026 que cita la Disposición 19/96 (no pude leer el texto oficial): están marcados para confirmar.',
    sources: [
      { title: 'Veda de pejerrey — Provincia de Buenos Aires', url: 'https://www.gba.gob.ar/desarrollo_agrario/pesca/articulos/veda_de_pejerrey' },
      { title: 'Comienza la veda del pejerrey (2026) — El Cronista', url: 'https://www.elcronista.ar/pejerrey-comienza-la-veda-de-la-pesca-deportiva-en-la-provincia-de-buenos-aires' },
      { title: 'Reglamento de pesca deportiva de la Provincia — Pesca en Argentina', url: 'https://www.pescaargentina.com.ar/noticia/reglamento-de-pesca-deportiva-de-la-provincia-de-buenos-aires-880' },
      { title: '¿Cómo pica el pejerrey? — Pescador Deportivo', url: 'https://pescadordeportivo.net/2021/04/01/como-pica-el-pejerrey/' },
      { title: 'Lagunas para pejerrey — Weekend', url: 'https://weekend.perfil.com/noticias/pesca/pejerrey-15-lagunas-para-un-buen-arranque.phtml' },
      { title: 'Pejerrey — SIB', url: 'https://sib.gob.ar/especies/odontesthes-bonariensis' },
      { title: 'Reglamento de pesca deportiva — Weekend', url: 'https://weekend.perfil.com/noticias/amp/pesca/reglamento-de-temporada-de-pesca-deportiva-de-la-provincia-de-buenos-aires-pejerrey-tararira-dorado-perca-trucha.phtml' },
    ],
  },
  {
    id: 'dientudo',
    name: 'Dientudo',
    scored: false,
    where: 'Laguna de Navarro, río Salado',
    recognize: 'Cuerpo alargado y aplastado de los costados, plateado, con colmillos marcados arriba y abajo. Llega a unos 30 cm.',
    carnadas: [
      { list: [
        '1) Mojarra.',
        '2) Lombriz.',
      ] },
      { p: '**Señuelos:** cucharita chica con plumas, de pala alargada. Ninguno de los del kit es de ese tamaño.' },
    ],
    habitat: [
      { list: [
        '**Dónde:** en los mismos lugares que la mojarra, que es lo que caza.',
        '**Profundidad:** de 20 a 40 cm bajo la superficie; también se lo saca de fondo.',
        '**Horario:** sin dato confiable.',
        '**Época:** todo el año, con picos de marzo a mayo y de septiembre a noviembre. En enero y febrero baja.',
      ] },
    ],
    equipo: [
      { list: [
        '**Armado:** sirve el equipo de pejerrey; pasternóster para probar distintas profundidades.',
        '**Anzuelo:** chico, según el tamaño de los que estén saliendo.',
        '**Cuidado:** los dientes cortan las brazoladas finas. Sugerencia (sin fuente): brazolada un poco más gruesa.',
      ] },
    ],
    tips: [
      { list: [
        'Con señuelo: dos o tres recogidas cortas y rápidas y una pausa; suele tomarlo en la pausa.',
        'Sacarle el anzuelo con el alicate del kit: tiene dientes filosos.',
        'Su filet es una de las mejores carnadas para pejerrey.',
      ] },
    ],
    confidence: 'Media: hay pocas fuentes específicas. No hay reglas oficiales encontradas para el dientudo.',
    sources: [
      { title: 'El dientudo — Pescador Deportivo', url: 'https://pescadordeportivo.net/2012/01/21/el-dientudo/' },
      { title: 'El dientudo — Tiempo de Pescar', url: 'http://tiempo-de-pescar.blogspot.com/2011/12/el-dientudo.html' },
      { title: 'Dientudo común — Pueblos y Pesca', url: 'https://pueblosypesca.com/especies/dientudo.html' },
    ],
  },
  {
    id: 'mojarra',
    name: 'Mojarra',
    scored: false,
    where: 'Laguna de Navarro, río Salado',
    recognize: 'Pez chico y plateado que anda en cardumen. Es la carnada viva más usada para pejerrey.',
    carnadas: [
      { list: [
        '1) Lombriz.',
        '2) Masa de harina.',
        '3) Perros del agua, que no se caen del anzuelo.',
      ] },
      { p: '**Encarnar:** con mucho pique, una lombriz que apenas tape la curva del anzuelo; con poco pique, cubrir todo el anzuelo.' },
    ],
    habitat: [
      { list: [
        '**Profundidad:** cerca de la superficie. Empezar a 15 cm y bajar de a 5 cm hasta encontrar dónde pican.',
        '**Horario y época:** sin dato confiable.',
      ] },
    ],
    equipo: [
      { list: [
        '**Armado:** caña mojarrera, nylon de 0,22 a 0,25 mm, anzuelo mojarrero de pata larga número 8 a 12, una munición a 5 cm del anzuelo y una boya mojarrera chica.',
        '**Del kit:** no sirve. La línea de 0,30 mm es gruesa y los anzuelos son grandes. Falta un equipo mojarrero, que es barato.',
      ] },
    ],
    tips: [
      { list: [
        'Lo más importante es encontrar la profundidad: si no pican, bajar la boya.',
        'Sirve de carnada viva para pejerrey, tararira y dientudo.',
      ] },
    ],
    confidence: 'Media.',
    sources: [
      { title: 'Mojarras, maestra de pescadores — Diana Outdoor', url: 'https://www.dianaoutdoor.com.ar/blogs/pesca/mojarras-maestra-de-pescadores/' },
      { title: 'Mojarrita, la súper carnada — Weekend', url: 'https://weekend.perfil.com/noticias/pesca/mojarrita-la-super-carnada-10-secretos-para-pescar-mejor-el-pejerrey.phtml' },
    ],
  },
  {
    id: 'vieja',
    name: 'Vieja del agua',
    scored: false,
    where: 'Laguna de Navarro',
    recognize: 'Cuerpo oscuro cubierto de placas óseas como una armadura, boca chica abajo, dos bigotes cortos y una aleta grande en el lomo con radios duros.',
    carnadas: [
      { list: [
        '**Principal:** lombriz.',
        '**Alternativas:** corazón vacuno, filet de pejerrey o de mojarra.',
      ] },
    ],
    habitat: [
      { list: [
        '**Dónde:** fondo barroso, en agua quieta con vegetación y poca profundidad. Se queda quieta en el fondo mucho tiempo.',
        '**Horario:** evita la luz: atardecer y antes del amanecer.',
        '**Época:** de diciembre a febrero.',
      ] },
    ],
    equipo: [
      { list: [
        '**Armado:** de fondo, con plomada corrediza, para que la carnada quede apoyada en el fondo.',
        '**Anzuelo:** chico, porque tiene la boca chica (sugerencia sin fuente; probar con los de carpa, número 6 a 4).',
        '**Del kit:** sirve todo para el armado de fondo.',
      ] },
    ],
    tips: [
      { list: [
        'Pica suave: esperar antes de clavar.',
        'Manipular con cuidado: tiene placas duras y radios rígidos en la aleta del lomo.',
      ] },
    ],
    confidence: 'Baja: hay pocas fuentes de pesca y casi todas son del Río de la Plata.',
    sources: [
      { title: 'Cómo pescar viejas del agua — La Licencia de Pesca', url: 'https://lalicenciadepesca.com/como-pescar-viejas-del-agua/' },
      { title: 'Vieja de agua — Pescador Deportivo', url: 'https://pescadordeportivo.net/2012/09/04/vieja-de-agua/' },
      { title: 'Vieja del agua — Día de Pesca', url: 'https://diadepesca.com.ar/pescado-vieja-del-agua/' },
    ],
  },
  {
    id: 'lisa',
    name: 'Lisa',
    scored: false,
    where: 'Río Salado, laguna de Lobos',
    recognize: 'Pez de mar que entra por el río Salado. No confundir con el sabalito, que es más chico (unos 20 cm) y se usa solo como carnada.',
    carnadas: [
      { list: [
        '1) Lombriz colorada.',
        '2) Carne vacuna.',
        '3) Pancita de lisa teñida de rojo, que además evita que piquen dientudos y mojarras.',
      ] },
      { p: '**Encarnar:** con la punta del anzuelo escondida dentro de la carnada.' },
    ],
    habitat: [
      { list: [
        '**Dónde:** en el río, en cardumen. No aparece en las fuentes sobre la laguna de Navarro.',
        '**Cómo buscarla:** tirar detrás del cardumen y traer la línea muy despacio.',
        '**Época:** con carnada, de fines de octubre a abril.',
      ] },
    ],
    equipo: [
      { list: [
        '**Armado:** línea de 3 boyas o línea aérea con varios anzuelos chicos y fuertes.',
        '**Del kit:** la caña de 2,40 m queda corta (se usan de unos 4 m) y faltan boyas.',
      ] },
    ],
    tips: [
      { list: [
        'Pique cerca: traer la línea despacio y estar atento.',
      ] },
    ],
    confidence: 'Media: datos del Salado, no de la laguna.',
    sources: [
      { title: 'Excelente pesca de lisas en el río Salado — El Día', url: 'https://www.eldia.com/nota/2016-1-28-excelente-pesca-de-lisas-en-el-rio-salado' },
      { title: 'En busca de lisas en el Salado — Weekend', url: 'https://weekend.perfil.com/noticias/pesca/en-busca-de-lisas-en-el-salado-pesca-con-carnada.phtml' },
      { title: 'Sabalito — Producción Animal', url: 'https://www.produccion-animal.com.ar/produccion_peces/peces_argentinos/29-sabalito.pdf' },
    ],
  },
  {
    id: 'bagre-amarillo',
    name: 'Bagre amarillo',
    scientific: 'Pimelodus maculatus',
    scored: false,
    where: 'Río Salado',
    recognize: 'Piel lisa sin escamas, pardo o verde amarillento con manchas oscuras; hasta 60 cm.',
    carnadas: [
      { list: [
        '1) Lombriz.',
        '2) Trozos de pescado.',
      ] },
    ],
    habitat: [
      { list: [
        '**Dónde:** de fondo.',
        '**Época:** todo el año; más activo en verano y otoño.',
      ] },
    ],
    equipo: [
      { list: [
        '**Armado:** de fondo con plomada corrediza.',
        '**Anzuelo:** grande y resistente, porque tiene la boca grande y fuerte.',
        '**Del kit:** los anzuelos de bagre (número 4 a 1) y las plomadas correderas sirven.',
      ] },
    ],
    tips: [
      { list: [
        'Tiene espinas en la aleta del lomo y en las de los costados. Un pinchazo duele mucho e hincha: agarrarlo con un trapo y usar el alicate.',
      ] },
    ],
    confidence: 'Media.',
    sources: [
      { title: 'Bagre amarillo — Pesca en Argentina', url: 'https://www.pescaargentina.com.ar/contenidos/especies-argentinas/bagre-amarillo/' },
      { title: 'Peces del Paraná: Pimelodus maculatus — Primera Edición', url: 'https://www.primeraedicion.com.ar/nota/100872456/peces-del-rio-parana-pimelodus-maculatus/' },
    ],
  },
  {
    id: 'pati',
    name: 'Patí',
    scientific: 'Luciopimelodus pati',
    scored: false,
    where: 'Río Salado',
    recognize: 'Bagre grande de bigotes largos; puede pasar el metro.',
    carnadas: [
      { list: [
        '1) Carnada viva (mojarra, sabalito o boga chica).',
        '2) Racimo de lombrices.',
        '3) Hígado o carne.',
      ] },
    ],
    habitat: [
      { list: [
        '**Dónde:** en pozones profundos, con agua turbia y poca correntada. En el Salado aparece solo de vez en cuando.',
        '**Época:** todo el año; mejor en invierno y primavera (dato de río).',
      ] },
    ],
    equipo: [
      { list: [
        '**Armado:** de fondo, con nylon de 0,40 mm.',
        '**Del kit:** la línea de 0,30 mm queda fina para un patí grande. Los anzuelos de bagre (número 4 a 1) sirven para los chicos.',
      ] },
    ],
    tips: [
      { list: [
        'Es de la misma familia que el bagre amarillo: cuidado con las espinas al sacarlo (sugerencia sin fuente específica).',
      ] },
    ],
    confidence: 'Baja para Navarro: los datos son del Paraná.',
    sources: [
      { title: 'Pesca de patí — Pesca en Argentina', url: 'https://www.pescaargentina.com.ar/contenidos/especies-argentinas/pati/' },
      { title: 'El patí — Pescador Deportivo', url: 'https://pescadordeportivo.net/2013/01/10/el-pati/' },
    ],
  },
  {
    id: 'boga',
    name: 'Boga',
    scientific: 'Megaleporinus obtusidens',
    scored: false,
    where: 'Río Salado',
    recognize: 'Pez de río con escamas que muerde con los dientes del frente. En el Salado aparece de vez en cuando.',
    carnadas: [
      { list: [
        '1) Masa blanda.',
        '2) Maíz hervido (o con esencia de vainilla).',
        '3) Lombriz.',
      ] },
      { p: '**Encarnar:** masa blanda, para que encuentre rápido la punta del anzuelo.' },
    ],
    habitat: [
      { list: [
        '**Dónde:** de fondo, al borde de juncales y en bancos de arena o piedra. Con correntada, plomo más pesado.',
        '**Época:** de noviembre a abril.',
      ] },
    ],
    equipo: [
      { list: [
        '**Armado:** de fondo, con la plomada entre los anzuelos y el pescador, para que la boga pueda arrastrar la carnada.',
        '**Del kit:** plomadas correderas y anzuelos de carpa (número 6 a 4) sirven (los anzuelos, sugerencia sin fuente).',
      ] },
    ],
    tips: [
      { list: [
        'Pique muy delicado: primero prueba la carnada y después la traga y sale corriendo fuerte. Clavar en esa corrida, no antes.',
      ] },
    ],
    confidence: 'Media: datos de río.',
    sources: [
      { title: 'La boga — Pescador Deportivo', url: 'https://pescadordeportivo.net/2012/03/06/la-boga-2/' },
      { title: 'Masa y maíz para boga y carpa — Sentí la Pesca', url: 'https://sentilapesca.com.ar/masa-y-maiz-para-boga-y-carpa/' },
      { title: 'Bogas: el desafío de las damas del río — Pesca en Argentina', url: 'https://pescaargentina.com.ar/noticia/bogas-el-desafio-de-las-damas-del-rio-431' },
    ],
  },
];

// Veda del pejerrey (Disposición 89/08): del 1/9 al 30/11.
export const VEDAS = { pejerrey: { from: [9, 1], to: [11, 30], text: 'Veda del 1 de septiembre al 30 de noviembre (Disposición 89/08). Durante la veda solo se puede pescar sábados, domingos y feriados, respetando el cupo.' } };

export const GENERAL_TIPS = [
  { list: [
    '**Presión:** lo mejor es que baje de a poco. Estable está bien. Si sube fuerte después de un frente, el pique cae. Si baja de golpe, se viene tormenta.',
    '**Temperatura del agua:** cada pez tiene su rango. Tararira y carpa casi no comen con el agua fría; en invierno, el pez de la laguna es el pejerrey.',
    '**Luna:** la mejor es la luna nueva, después los cuartos; la luna llena es la peor.',
    '**Horario:** amanecer y atardecer son los mejores momentos.',
    '**Color del señuelo:** agua turbia, colores fuertes; agua clara, colores naturales; con sol, brillantes; nublado, oscuros.',
    '**Tormenta eléctrica:** salir del agua y guardar la caña. Es lo único peligroso de verdad.',
  ] },
];
