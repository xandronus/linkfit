import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as redeem from './components/RedeemHistory'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>LinkFit</title>
        <meta name="description" content="LFIT Crypto Token" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}>
          <Image src="/resources/linkfit.png" alt="LinkFit Logo" width={100} height={100} className={styles.title}/>
          <h1 className={styles.title}>
            LinkFit
          </h1>
        </div>

        <p className={styles.description}>
           Earn Crypto Rewards for Exercise!
        </p>

        <div className={styles.grid}>
          <a href="https://github.com/xandronus/linkfit" className={styles.card}>
            <Image src="/resources/GitHub-Mark-64px.png" alt="LinkFit Logo" width={64} height={64}/>            
            <h2>Github &rarr;</h2>
            <p>Find in-depth information about browse the source.</p>
          </a>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <redeem.RedeemHistory />
          </div>
        </div>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/xandronus/linkfit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
