import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ReactNode, useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from "axios";
import { formatISO9075 } from 'date-fns'

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
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
];

interface Articles {
  articles: [Article];
}

interface Article {
  id: number;
  article_id: number;
  points: number;
  title: string;
  url: string;
  created_at: string;
}

interface Props {
  data: {
    total_pages: number,
    total_rows: number,
    articles: Articles,
  }
}

export default function Home(props: Props) {
  const data = props.data;
  const [totalRows, setTotalRows] = useState(data.total_rows);
  const [articles, setArticles] = useState(remapArticles(data.articles));
  const [loading, setLoading] = useState(false);

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
       }}
       loading={loading}
      />
    </div>
  )

  function onPageChange(page: number, rowsPerPage: number) {
    setLoading(true);
    getArticles(page, rowsPerPage).then((data) => {
      const localArticles = remapArticles(data.articles)

      setArticles(localArticles);
    });
    setLoading(false);
  }

}

function makeLink(url: string): ReactNode {
  if (url.length < 1) {
    return <></>
  }
  return <a href={url} target="_blank">{url}</a>
}

async function getArticles(page: number, rowsPerPage: number) {
  const payload = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  return await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/?page=${page}&rows-per-page=${rowsPerPage}`, payload
    ).then((res) => {
      return res.data;
      });
}

function remapArticles(articles: Articles) {
  return articles.map((article: Article) => {
    return {
      id: article.id,
      points: article.points,
      title: article.title,
      link: makeLink(article.url),
      date: formatISO9075(new Date(article.created_at)),
    }
  });
}

export async function getStaticProps() {
  const data = await getArticles(1, 10);
  return {
    props: {
      data,
    },
  };
}
