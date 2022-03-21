import { useGraph } from "./lib/useGraph";
import { Button, Image, Text } from "@fluentui/react-northstar";
import { useLoader } from "./lib/useLoader";
import * as microsoftTeams from '@microsoft/teams-js';
import { b64toBlob } from "./lib/b64toBlobConverter"

export function TeamsClasses () {
    const { loading, data, reload } = useGraph(
        async (graph) => {
          const teamId = await graph.api("/me/joinedTeams").select('id').get();
          const replyBody = [];
          teamId.value.some((e) => {
            replyBody.push({id : `${e.id}`, method: "GET", url: `teams/${e.id}?$select=webUrl,displayName`},
            {id : `${e.id}Image`, method: "GET", url: `teams/${e.id}/photo/$value`, responseType : 'blob'});
          });
          const reply = { requests : replyBody }; 
          const teamData = await graph.api('/$batch').version('beta').post(reply);
          const [photos, descriptions] = teamData.responses.reduce((result, element) => {
            result[element.headers["Content-Type"] === "image/jpg" ? 0 : 1].push(element); 
            return result;
            },
          [[], []]);   
          return { photos, descriptions };
        },
        { scope: ["Directory.Read.All"] }
    )
    const { data : dataP , loading : loadingP} = useLoader(async () => {
        const promise = fetch('/Classes.txt').then((r) => r.text()); 
        return await promise; 
    });
      const getImageSrc = (identifier) => {
        console.log(identifier); 
        const blob = b64toBlob(data.photos.find(e => e.id === `${identifier}Image`).body);
         return (URL.createObjectURL(blob));
      }

    return (
        <>
        <Button primary content="Authorize" disabled={loading} onClick={reload} />
            {!loading && data && !loadingP && dataP 
            &&(
                data.descriptions.map((element, i) => {
                        const found = dataP.find(e => e.id === element.body.displayName.substring(3,13)); 
                        return (<Button 
                                    style={{ height : "100%", margin : "10px", display : "flex", flexDirection : "column" }}
                                    key ={found === undefined ? element.body.displayName : found.name} 
                                    onClick={() => microsoftTeams.executeDeepLink(element.body.webUrl)} 
                                    fluid >
                                        <Image className="team-name" src = {getImageSrc(element.id)}></Image>
                                        <Text style={{textAlign : "center", margin : "10px"}}>{found === undefined ? element.body.displayName : found.name}</Text>
                                </Button>)

                }) 
            )
            }
        </>
    )
}