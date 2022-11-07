import { useEffect, useContext, useState } from "react";

// next components
import Head from "next/head";

// custom components
import WalletButton from "components/Button/WalletButton";
import Tab from "components/Tab";
import ProjectSection from "components/ProjectSection";
import ContributionSection from "components/ContributionSection";
import ReleaseSection from "components/ReleaseSection";

// json
import TabList from "assets/json/tab-list.json";

// styles
import styles from "./index.module.scss";

const Home = () => {
  const [activeTab, setActiveTab] = useState(0);

  const [tabList, setTabList] = useState(TabList);
  useEffect(() => {
    let array = [];
    TabList.map((item) => {
      let object = item;
      if (item.id === activeTab) {
        object.selected = true;
      } else {
        object.selected = false;
      }
      array.push(object);
    });
    setTabList(array);
  }, [activeTab]);

  const handleSelectedTab = (item) => {
    setActiveTab(item.id);
  };

  return (
    <div className="g-container">
      <Head>
        <title>Elbow</title>
        <meta name="description" content="This is a test project of Elbow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <div className="w-full flex justify-end py-6">
          <WalletButton />
        </div>
        <div className="w-full flex flex-wrap justify-center">
          <Tab tabList={tabList} onChange={(item) => handleSelectedTab(item)} />
          {activeTab === 0 && <ProjectSection />}
          {activeTab === 1 && <ContributionSection />}
          {activeTab === 2 && <ReleaseSection />}
        </div>
      </main>
    </div>
  );
};

export default Home;
