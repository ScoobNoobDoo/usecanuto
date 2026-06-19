export type HelpPage = {
  title: string;
  subtitle: string;
  sections: { heading?: string; body: string }[];
};

export const HELP_PAGES: Record<string, HelpPage> = {
  trocas: {
    title: "Trocas e Devoluções",
    subtitle: "Política de trocas UseCanuto",
    sections: [
      {
        body: "Você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução. A peça deve estar sem uso, com etiquetas e na embalagem original.",
      },
      {
        heading: "Como solicitar",
        body: "Entre em contato pelo WhatsApp ou e-mail informando o número do pedido, o motivo e a nova opção desejada (tamanho, cor ou devolução).",
      },
      {
        heading: "Frete de troca",
        body: "A primeira troca é gratuita para todo o Brasil. Devoluções com reembolso seguem o mesmo prazo, com estorno em até 10 dias úteis após conferência.",
      },
    ],
  },
  entregas: {
    title: "Entregas",
    subtitle: "Prazos e modalidades",
    sections: [
      {
        body: "Enviamos para todo o Brasil via transportadora parceira. O prazo estimado é de 5 a 12 dias úteis, conforme a região.",
      },
      {
        heading: "Frete grátis",
        body: "Compras acima de R$ 399 têm frete grátis. Abaixo desse valor, o frete é calculado no checkout conforme o CEP.",
      },
      {
        heading: "Rastreamento",
        body: "Após o despacho, você recebe o código de rastreio por e-mail. Em caso de dúvida, fale conosco pelo WhatsApp.",
      },
    ],
  },
  pagamento: {
    title: "Pagamento",
    subtitle: "Formas aceitas",
    sections: [
      {
        body: "Aceitamos cartão de crédito em até 6x sem juros e PIX com aprovação instantânea.",
      },
      {
        heading: "Segurança",
        body: "Os pagamentos são processados por plataforma certificada. Seus dados de cartão não são armazenados em nossos servidores.",
      },
      {
        heading: "PIX",
        body: "Ao escolher PIX, você recebe as instruções na finalização do pedido. O pedido é confirmado após a compensação.",
      },
    ],
  },
  sobre: {
    title: "A Marca",
    subtitle: "UseCanuto",
    sections: [
      {
        body: "UseCanuto nasceu para vestir mulheres com elegância e protagonismo. Cada peça é pensada para combinar sofisticação e conforto no dia a dia.",
      },
      {
        body: "Nossa curadoria prioriza tecidos de qualidade, caimento impecável e versatilidade — do escritório ao fim de semana.",
      },
    ],
  },
  privacidade: {
    title: "Política de Privacidade",
    subtitle: "Seus dados",
    sections: [
      {
        body: "Coletamos apenas os dados necessários para processar pedidos e melhorar sua experiência: nome, e-mail, telefone e endereço de entrega.",
      },
      {
        body: "Não vendemos seus dados. Você pode solicitar exclusão ou atualização entrando em contato pelo e-mail de suporte.",
      },
    ],
  },
  termos: {
    title: "Termos de Uso",
    subtitle: "Condições gerais",
    sections: [
      {
        body: "Ao utilizar o site UseCanuto, você concorda com nossas políticas de compra, troca e privacidade.",
      },
      {
        body: "Preços e disponibilidade podem ser alterados sem aviso prévio. Pedidos confirmados mantêm o valor acordado no momento da compra.",
      },
    ],
  },
};