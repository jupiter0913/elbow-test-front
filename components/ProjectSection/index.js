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
  }, [connected, signer]);

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

  return (
    <div className={styles.container}>
      <div className="w-full flex gap-[100px] items-center">
        <div className="flex flex-1 flex-wrap gap-4">
          <div className="w-full">
            <Input
              value={projectName}
              placeholder="Project Name"
              onChange={(value) => setProjectName(value)}
            />
          </div>
          <div className="w-full">
            <Input
              value={projectDescription}
              placeholder="Project Description"
              onChange={(value) => setProjectDescription(value)}
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
