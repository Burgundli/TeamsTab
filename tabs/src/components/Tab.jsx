import React from "react";
import { useTeamsFx } from "./lib/useTeamsFx";
import { TeamsClasses } from "./TeamsClasses";

export default function Tab() {
  const { themeString } = useTeamsFx();
  return (
    <div className={themeString === "default" ? "" : "dark"} style ={{ display : "grid", gridTemplateColumns : "repeat(auto-fit, minmax(300px, 2fr))", gridGap : "1rem", gridAutoRows : "200px", minHeight : "100%", maxHeight : "max-content" , padding : "20px"}}>
       <TeamsClasses></TeamsClasses>
    </div>
  );
}
