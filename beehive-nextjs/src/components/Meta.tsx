import { FC } from 'react'
import Head from "next/head";

interface MetaProps {
  title: string
 
}

const Meta: FC<MetaProps> = ({ title}) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content="ECE relievers, ECE teachers, Early Childhood Centres, Childcare" />
      <meta name="description" content="Beehive joins early childcare relief teachers with early childcare centres." />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
    </Head>
  )
}



export default Meta
