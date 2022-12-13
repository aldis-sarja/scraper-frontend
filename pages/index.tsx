import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ReactNode, useState, useEffect } from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: 'Points',
    dataIndex: 'points',
    key: 'points',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Link',
    dataIndex: 'link',
    key: 'link',
  },
];


export default function Home({ data }) {
  // const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(data.total_rows);
  const [articles, setArticles] = useState(remapArticles(data.articles));
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);

  // console.log("~~~~~~~~~~~~~~~~~~~~~~:", remapArticles(data.articles));

  return (
    <div className={styles.container}>
      <Head>
        <title>Scraper</title>
        <meta name="description" content="Scrapper App for news.ycombinator.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Table
       columns={columns}
       dataSource={articles}
       pagination={{
         position: ['bottomCenter'],
         total: totalRows,
         defaultCurrent: 1,
         onChange: onPageChange,
         onShowSizeChange: onPerRowsChange,
       }}
       loading={loading}
      />
    </div>
  )

  function onPageChange(page: number, rowsPerPage: number) {
    setLoading(true);
    console.log("ŠĪ HUIŅA TIEK IZSAUKTA NO onPageChange:", page);
    getArticles(page, rowsPerPage).then((data) => {
      console.log("ŠĪ HUIŅA TIEK IZSAUKTA NO onPageChange PĒC getArticles:", data);
      const localArticles = remapArticles(data.articles)

      setArticles(localArticles);
    });
    setLoading(false);
  }

  function onPerRowsChange(rowsPerPages: number) {
    setPerPage(rowsPerPages);
  }
}

function makeLink(url: string): ReactNode {
  if (url.length < 1) {
    return <></>
  }
  return <a href={url} target="_blank">{url}</a>
}

async function getArticles(page: number, rowsPerPage: number) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/?page=${page}&rows-per-page=${rowsPerPage}`, {
      method: 'GET',
      mode: 'no-cors',
    }).then((res) => res.json());
}

function remapArticles(articles) {
  return articles.map((article) => {
    return {
      id: article.id,
      points: article.points,
      title: article.title,
      link: makeLink(article.url),
    }
  });
}

export async function getStaticProps() {
  const data = await getArticles(1, 10);
  // console.log("getStaticProps:", data);
  return {
    props: {
      data,
    },
  };
}
