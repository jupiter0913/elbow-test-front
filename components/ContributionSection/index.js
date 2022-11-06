import { useState } from "react";

// custom components
import Button from "components/Button";
import Input from "components/Input";
import Select from "components/Select";

// json
import ProjectList from "assets/json/project-list.json";

// styles
import styles from "./index.module.scss";

const ContributionSection = () => {
  const [selectedProject, setSelectedProject] = useState(ProjectList[0]);

  return (
    <div className={styles.container}>
      <div className="w-full flex gap-[100px]">
        <div className="flex flex-1 flex-wrap gap-4">
          <div className="w-full">
            <Select
              data={ProjectList}
              selected={selectedProject}
              onChange={(item) => setSelectedProject(item)}
            />
          </div>
          <div className="w-full flex gap-4">
            <Button
              label="100"
              onClick={() => {}}
              backgroundColor="rgb(65, 75, 178)"
              height="40px"
            />
            <Button
              label="500"
              onClick={() => {}}
              backgroundColor="rgb(65, 75, 178)"
              height="40px"
            />
            <Button
              label="1000"
              onClick={() => {}}
              backgroundColor="rgb(65, 75, 178)"
              height="40px"
            />
            <Button
              label="Custom"
              onClick={() => {}}
              backgroundColor="rgb(65, 75, 178)"
              height="40px"
            />
          </div>
        </div>
        <div>
          <Button label="Approve & Contribute" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default ContributionSection;
