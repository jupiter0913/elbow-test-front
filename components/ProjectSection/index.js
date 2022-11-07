import { useEffect, useContext, useState } from "react";

// custom components
import Button from "components/Button";
import Input from "components/Input";
import Select from "components/Select";

import { Web3ModalContext } from "contexts/Web3ModalProvider";
import { getContract } from "utils";
// json
import TokenList from "assets/json/token-list.json";
import Crowdfund from "assets/abis/Crowdfund.json";

// styles
import styles from "./index.module.scss";

const ProjectSection = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [selectedToken, setSelectedToken] = useState(TokenList[0]);

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

    fetchProjects();
  }, [connected, signer]);

  useEffect(() => {
    if (!tokenContract) return;
    const fetchContractInfo = async () => {};
    fetchContractInfo();
  }, [tokenContract]);

  const handleCreateProject = async () => {
    if (!tokenContract) return;
    await (
      await tokenContract.createProject(
        projectName,
        projectDescription,
        selectedToken.address,
        raiseAmount
      )
    ).wait();
  };

  const handleCreateContribution = async () => {
    if (!tokenContract) return;
    console.log(selectedToken.address);
    await (
      await tokenContract.createProject(1, raiseAmount * pow(10, 18))
    ).wait();
  };

  const fetchProjects = async () => {
    if (!tokenContract) return;
    const projectCount = Number(await tokenContract.projectCount());
    console.log(projectCount);

    for (let i = 1; i <= projectCount; i++) {
      const projectInfo = await tokenContract.getProject(i);
      console.log(projectInfo);
    }
  };

  return (
    <div className={styles.container}>
      <div className="w-full flex gap-[100px]">
        <div className="flex flex-1 flex-wrap gap-4">
          <div className="w-full">
            <Input
              value={projectName}
              placeholder="Project Name"
              onChange={(value) => setProjectName(value)}
            />
          </div>
          <div className="w-full flex gap-8">
            <div>
              <Input
                value={raiseAmount}
                placeholder="Raise Amount"
                onChange={(value) => {
                  setRaiseAmount(value);
                }}
              />
            </div>
            <div className="flex flex-1">
              <Select
                data={TokenList}
                selected={selectedToken}
                onChange={(item) => setSelectedToken(item)}
              />
            </div>
          </div>
        </div>
        <div>
          <Button label="Create Project" onClick={handleCreateProject} />
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;
