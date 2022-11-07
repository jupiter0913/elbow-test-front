import { useEffect, useContext, useState } from "react";

// custom components
import Button from "components/Button";
import Select from "components/Select";

import { Web3ModalContext } from "contexts/Web3ModalProvider";
import { getContract } from "utils";

// json
import Crowdfund from "assets/abis/Crowdfund.json";
import MockUSDC from "assets/abis/MockUSDC.json";

// styles
import styles from "./index.module.scss";

const ContributionSection = (props) => {
  const { projectInfo } = props;
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});

  useEffect(() => {
    if (projectInfo.length !== 0) {
      let array = [];
      projectInfo.map((item, index) => {
        let object = {};
        object.id = Number(item[0]);
        object.label = item[2];
        object.value = item[2];
        array.push(object);
      });
      setSelectedProject(array[0]);
      setProjectList(array);
    }
  }, [projectInfo]);

  const [selectedAmount, setSelectedAmount] = useState(0);

  const [allowance, setAllowance] = useState(0);
  const { account, connected, signer } = useContext(Web3ModalContext);
  const [tokenContract, setTokenContract] = useState();
  const [usdcContract, setUSDCContract] = useState();

  useEffect(() => {
    if (!connected || !signer) return;
    const fetchContract = async () => {
      setTokenContract(
        await getContract(Crowdfund.address, Crowdfund.abi, signer)
      );
      setUSDCContract(
        await getContract(MockUSDC.address, MockUSDC.abi, signer)
      );
    };
    fetchContract();
  }, [connected, signer]);

  useEffect(() => {
    checkAllowance();
  }, [selectedAmount]);

  const checkAllowance = async () => {
    if (!usdcContract || !tokenContract) return;
    const allowed = await usdcContract.allowance(
      account,
      tokenContract.address
    );
    setAllowance(Number(allowed) / Math.pow(10, 18));
  };

  const handleApprove = async () => {
    if (!usdcContract || !tokenContract) return;
    await (
      await usdcContract.approve(
        tokenContract.address,
        Number(selectedAmount * Math.pow(10, 18)).toString()
      )
    ).wait();
  };

  const handleCreateContribution = async () => {
    if (!tokenContract) return;
    await (
      await tokenContract.createContribution(
        selectedProject.id,
        Number(selectedAmount * Math.pow(10, 18)).toString()
      )
    ).wait();
  };

  return (
    <div className={styles.container}>
      <div className="w-full flex gap-[100px] items-center">
        <div className="flex flex-1 flex-wrap gap-4">
          <div className="w-full">
            {projectList.length !== 0 && (
              <Select
                data={projectList}
                selected={selectedProject}
                onChange={(item) => setSelectedProject(item)}
              />
            )}
          </div>
          <div className="w-full">Contribution Amount: {selectedAmount}</div>
          <div className="w-full flex gap-4">
            <Button
              label="100"
              onClick={() => setSelectedAmount(100)}
              backgroundColor="rgb(65, 75, 178)"
              height="40px"
            />
            <Button
              label="500"
              onClick={() => setSelectedAmount(500)}
              backgroundColor="rgb(65, 75, 178)"
              height="40px"
            />
            <Button
              label="1000"
              onClick={() => setSelectedAmount(1000)}
              backgroundColor="rgb(65, 75, 178)"
              height="40px"
            />
            <Button
              label="Custom"
              onClick={() => setSelectedAmount(100)}
              backgroundColor="rgb(65, 75, 178)"
              height="40px"
            />
          </div>
        </div>
        <div>
          {allowance < selectedAmount ? (
            <Button label="Approve" onClick={handleApprove} />
          ) : (
            <Button label="Contribute" onClick={handleCreateContribution} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionSection;
