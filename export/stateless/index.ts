import { createMachine } from "xstate";
import { NameForGolang } from '../../utils/go';


export function exportAsCode(json: string):string{
    const xstateObj = JSON.parse(json)
    // may is null
    const context = xstateObj.context
    const fetchMachine = createMachine<any>(xstateObj)

    const event_names = fetchMachine.events
    const state_nodes = new Map<string, any>()

    Object.entries(fetchMachine.states).map(([key, value]) => {
        state_nodes.set(value.id, value)
    })
    

    let code = `package state
import "github.com/qmuntal/stateless"

type State string
type Trigger string

const (
${
    // build state and event 
    function(){
        const states:string[] = []
        state_nodes.forEach((value, key) => {
            states.push(`\t${NameForGolang(key)} State`)
        })
        return states.join('\n')
    }()
}
)

const (
${
    function(){
        const events:string[] = []
        event_names.forEach((value, index) => {
            events.push(`\t${NameForGolang(value)} Trigger`)
        })
        return events.join('\n')
    }()
}
)


func ${fetchMachine.id}() *stateless.StateMachine {
\tmachine := stateless.NewStateMachine(${
    // @ts-ignore
    NameForGolang(fetchMachine.id+"."+fetchMachine.initial)
})

${
    function(){
        const states:string[] = []
        // build the relation of state
        state_nodes.forEach((value, key) => {
            let state_statement = `\tmachine.Configure(${NameForGolang(key)})`
    
            if(value.initial){
                state_statement = state_statement.concat(`\n\t\t.Initial(${NameForGolang(key+"."+value.initial)})`)
            }
    
            if(value.parent){
                state_statement = state_statement.concat(`\n\t\t.SubstateOf(${NameForGolang(value.parent.id)})`)
            }
    
            // process on
            if(value.on){
                Object.entries(value.on).map(([key, events]) => {
                    // @ts-ignore
                    events.map((event:any) => {
                        // events
                        event.target.map((target:any) => {
                            state_statement = state_statement.concat(`\n\t\t.Permit(${NameForGolang(key)},${NameForGolang(target.id)})`)
                        })
    
                        // invoke
                        // WIP
    
                        // action
                        // WIP
    
                        // graud
                        // WIP
                    })
                })
            }
            states.push(state_statement)
        })
        return states.join('\n')
    }()
}
    return machine
}
`
    return code
}