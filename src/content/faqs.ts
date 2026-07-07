import type { Faq } from "@/types/content";

/**
 * FAQ content — targets long-tail SEO queries and feeds FAQPage JSON-LD.
 * TODO(marketing): validate with the sales team and replace with the 10–15
 * REAL most-asked questions (docs/marketing-material-request.md §3).
 */
export const faqs: Faq[] = [
  {
    question: "¿Qué tipos de plástico compran y reciclan?",
    answer:
      "Nos especializamos en termoplásticos de ingeniería y commodities de origen post-industrial: ABS, policarbonato (PC), PC/ABS, nylon (PA6 y PA66), POM, polipropileno (PP), polietileno (PE/HDPE), HIPS y PET, entre otros. Si tu material no está en la lista, contáctanos: lo evaluamos sin compromiso.",
  },
  {
    question: "¿Compran scrap plástico? ¿Cómo funciona?",
    answer:
      "Sí. Visitamos tu planta, evaluamos el material y el volumen que generas, y te proponemos un esquema de compra con recolecciones programadas. Cada retiro queda documentado para tus auditorías ambientales.",
  },
  {
    question: "¿En qué zonas ofrecen recolección de scrap?",
    answer:
      "La venta de polímeros tiene cobertura nacional. Para recolección de scrap operamos principalmente en el centro del país, y para volúmenes importantes evaluamos recolecciones en cualquier región.",
  },
  {
    question: "¿Qué certificaciones y permisos tienen?",
    answer:
      "Contamos con certificación ISO 9001:2015 en nuestro sistema de gestión de calidad, registro IMMEX, número DUNS y las autorizaciones ambientales oficiales para el manejo y transporte de residuos plásticos de manejo especial.",
  },
  {
    question: "¿Venden material reciclado? ¿En qué presentaciones?",
    answer:
      "Sí, comercializamos polímeros de ingeniería reciclados en molido o pellet, en sacos de 25 kg o súper sacos. La disponibilidad de materiales cambia constantemente; consulta nuestro stock o solicita el material que buscas.",
  },
  {
    question: "¿Manejan volúmenes mínimos de compra o venta?",
    answer:
      "Trabajamos principalmente volúmenes industriales, pero cada caso se evalúa individualmente. Contáctanos con el material y la cantidad que necesitas o que generas y te respondemos a la brevedad.",
  },
  {
    question: "¿Puedo solicitar una muestra del material antes de comprar?",
    answer:
      "Sí. Para compras de material reciclado podemos proporcionar muestras para que valides el material en tu proceso antes de cerrar el pedido.",
  },
  {
    question: "¿Ofrecen maquila de molienda o peletizado de mi propio material?",
    answer:
      "Sí. Recibimos tu scrap o material fuera de especificación, lo molemos y/o peletizamos según tu especificación de granulometría, y te lo devolvemos listo para reincorporarlo a tu producción.",
  },
  {
    question: "¿Cómo solicito una cotización?",
    answer:
      "Escríbenos por WhatsApp, llámanos o llena el formulario de contacto indicando el servicio que te interesa, el material y el volumen aproximado. Te respondemos en horario hábil, normalmente el mismo día.",
  },
  {
    question: "¿Qué documentación entregan por cada recolección?",
    answer:
      "Cada movimiento queda respaldado con la documentación de transporte y manejo correspondiente, que te sirve como evidencia de disposición adecuada ante auditorías ambientales y corporativas.",
  },
];
