import { useEffect, useContext, useState } from "react";

// custom components
import Button from "components/Button";
import Input from "components/Input";
import Select from "components/Select";

import { Web3ModalContext } from "contexts/Web3ModalProvider";
import { getContract } from "utils";

// json
import ProjectList from "assets/json/project-list.json";
import Crowdfund from "assets/abis/Crowdfund.json";

// styles
import styles from "./index.module.scss";

const ReleaseSection = (props) => {
  const { projectInfo } = props;
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});

  useEffect(() => {
    if (projectInfo.length !== 0) {
      let array = [];
      projectInfo.map((item, index) => {
        let object = {};
        object.id = Number(item.data[0]);
        object.label = item.data[2];
        object.value = item.data[2];
        array.push(object);
      });
      setSelectedProject(array[0]);
      setProjectList(array);
    }
  }, [projectInfo]);

  const [releaseAmount, setReleaseAmount] = useState(0);
  const [releaseAddress, setReleaseAddress] = useState("");

  const { account, connected, signer } = useContext(Web3ModalContext);
  const [tokenContract, setTokenContract] = useState();

  useEffect(() => {
    if (!connected || !signer) return;
    const fetchContract = async () => {
      setTokenContract(
        await getContract(Crowdfund.address, Crowdfund.abi, signer)
      );
    };
    fetchContract();
  }, [connected, signer]);

  const handleRelaseFund = async () => {
    await (
      await tokenContract.releaseFund(
        selectedProject.id,
        Number(releaseAmount * Math.pow(10, 18)).toString(),
        releaseAddress
      )
    ).wait();
  };

  return (
    <div className={styles.container}>
      <div className="w-full flex gap-[100px] items-center">
        <div className="flex flex-1 flex-wrap gap-4">
          <div className="w-full flex gap-8">
            <div className="w-full flex flex-1">
              {projectList.length !== 0 && (
                <Select
                  data={projectList}
                  selected={selectedProject}
                  onChange={(item) => setSelectedProject(item)}
                />
              )}
            </div>
            <div className="w-full flex flex-1">
              <Input
                value={releaseAmount}
                placeholder="Release Amount"
                onChange={(value) => {
                  setReleaseAmount(value);
                }}
              />
            </div>
          </div>
          <div className="w-full">
            <Input
              value={releaseAddress}
              placeholder="Release Address"
              onChange={(value) => setReleaseAddress(value)}
            />
          </div>
        </div>
        <div>
          <Button label="Release" onClick={handleRelaseFund} />
        </div>
      </div>
    </div>
  );
};

export default ReleaseSection;
