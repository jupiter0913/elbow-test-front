import { useEffect, useContext, useState } from "react";

// next components
import Head from "next/head";

// custom components
import WalletButton from "components/Button/WalletButton";
import Tab from "components/Tab";
import ProjectSection from "components/ProjectSection";
import ContributionSection from "components/ContributionSection";
import ReleaseSection from "components/ReleaseSection";

import { Web3ModalContext } from "contexts/Web3ModalProvider";
import { getContract } from "utils";

// json
import Crowdfund from "assets/abis/Crowdfund.json";
import TabList from "assets/json/tab-list.json";

// styles
import styles from "./index.module.scss";

const Home = () => {
  const { account, connected, signer } = useContext(Web3ModalContext);
  const [tokenContract, setTokenContract] = useState();

  const [projectInfo, setProjectInfo] = useState([]);

  useEffect(() => {
    if (!connected || !signer) return;
    const fetchContract = async () => {
      setTokenContract(
        await getContract(Crowdfund.address, Crowdfund.abi, signer)
      );
    };
    fetchContract();
  }, [connected, signer]);

  useEffect(() => {
    if (!tokenContract) return;
    const fetchAllProjects = async () => {
      const projectCount = Number(await tokenContract.projectCount());
      let array = [];
      for (let i = 1; i <= projectCount; i++) {
        const result = await tokenContract.getProject(i);
        const raisedAmount = await tokenContract.getRaisedAmount(i);
        const releasedAmount = await tokenContract.getReleasedAmount(i);
        let object = {};
        object.data = result;
        object.raisedAmount = raisedAmount / Math.pow(10, 18);
        object.releasedAmount = releasedAmount / Math.pow(10, 18);
        array.push(object);
      }

      setProjectInfo(array);
    };
    fetchAllProjects();
  }, [tokenContract]);

  useEffect(() => {}, [projectInfo]);

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
          {activeTab === 1 && <ContributionSection projectInfo={projectInfo} />}
          {activeTab === 2 && <ReleaseSection projectInfo={projectInfo} />}
        </div>

        <table className="w-full table-auto mt-10">
          <thead>
            <tr>
              <th className="text-left">Project Name</th>
              <th className="text-left">Creator (Wallet Address)</th>
              <th className="text-left">Token</th>
              <th className="text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {projectInfo.length !== 0 &&
              projectInfo.map((item, index) => (
                <tr key={index}>
                  <td>{item.data[2]}</td>
                  <td>{item.data[1]}</td>
                  <td>{item.data[4]}</td>
                  <td>
                    {Number(item.data[5])}({Number(item.raisedAmount)} /{" "}
                    {Number(item.releasedAmount)})
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Home;
