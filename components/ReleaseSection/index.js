import { useState } from "react";

// custom components
import Button from "components/Button";
import Input from "components/Input";
import Select from "components/Select";

// json
import ProjectList from "assets/json/project-list.json";

// styles
import styles from "./index.module.scss";

const ReleaseSection = () => {
  const [selectedProject, setSelectedProject] = useState(ProjectList[0]);
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [projectName, setProjectName] = useState("");

  return (
    <div className={styles.container}>
      <div className="w-full flex gap-[100px]">
        <div className="flex flex-1 flex-wrap gap-4">
          <div className="w-full flex gap-8">
            <div className="w-full flex flex-1">
              <Select
                data={ProjectList}
                selected={selectedProject}
                onChange={(item) => setSelectedProject(item)}
              />
            </div>
            <div className="w-full flex flex-1">
              <Input
                value={raiseAmount}
                placeholder="Raise Amount"
                onChange={(value) => {
                  setRaiseAmount(value);
                }}
              />
            </div>
          </div>
          <div className="w-full">
            <Input
              value={projectName}
              placeholder="Project Name"
              onChange={(value) => setProjectName(value)}
            />
          </div>
        </div>
        <div>
          <Button label="Approve & Release" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default ReleaseSection;
