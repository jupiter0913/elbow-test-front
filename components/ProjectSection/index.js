import { useState } from "react";

// custom components
import Button from "components/Button";
import Input from "components/Input";
import Select from "components/Select";

// json
import TokenList from "assets/json/token-list.json";

// styles
import styles from "./index.module.scss";

const ProjectSection = () => {
  const [projectName, setProjectName] = useState("");
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [selectedToken, setSelectedToken] = useState(TokenList[0]);

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
          <div className="w-full flex gap-[30px]">
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
          <Button label="Create Project" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;
