import { createMachine } from "xstate";
import { NameForGolang } from '../../utils/go';


export function exportAsCode(json: string):string{
    const xstateObj = JSON.parse(json)
    // may is null
    const context = xstateObj.context
    const fetchMachine = createMachine<any>(xstateObj)

    const event_names = fetchMachine.events

    
    // get all state from fetchMachine
    const state_nodes = new Map<string, any>()
    const queue:any[] = []

    Object.entries(fetchMachine.states).map(([key, value]) => {
        // state_nodes.set(value.id, value)
        queue.push(value)
    })
    
    // iterate state_nodes to push the children state
    while (queue.length > 0) {
        const current_state = queue.shift()
        state_nodes.set(current_state.id, current_state)

        if(current_state){
            state_nodes.set(current_state.id, current_state)
            if(current_state.states){
                Object.entries(current_state.states).map(([key, value]) => {
                    queue.push(value)
                })
            }
        }
    }
    // --------


    let code = `package state
import "github.com/qmuntal/stateless"

type State string
type Trigger string

const (
${
    `    ${NameForGolang(fetchMachine.id)} State = "${fetchMachine.id}"`
}
${
    // build state and event 
    function(){
        const states:string[] = []
        state_nodes.forEach((value, key) => {
            states.push(`    ${NameForGolang(key)} State = "${key}"`)
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
            events.push(`    ${NameForGolang(value)} Trigger = "${value}"`)
        })
        return events.join('\n')
    }()
}
)


func Create_${NameForGolang(fetchMachine.id)}() *stateless.StateMachine {
    machine := stateless.NewStateMachine(${
    // @ts-ignore
    NameForGolang(fetchMachine.id+"."+fetchMachine.initial)
})

${
    function(){
        const states:string[] = []
        // build the relation of state
        state_nodes.forEach((value, key) => {
            let state_statement = `    machine.Configure(${NameForGolang(key)})`
    
            if(value.initial){
                state_statement = state_statement.concat(`.InitialTransition(${NameForGolang(key+"."+value.initial)})`)
            }
    
            if(value.parent){
                state_statement = state_statement.concat(`.SubstateOf(${NameForGolang(value.parent.id)})`)
            }

            if(value.onEntry.length > 0){
                state_statement = state_statement.concat(`.OnEntry(func(_ context.Context, _ ...any) error {\n${
                    value.onEntry.map((entry_action:any) => {
                        console.log(entry_action)
                        return `\t\t${NameForGolang(entry_action.type)}()\n`
                    }) 
                }\t}`)
            }

            if(value.onExit.length  > 0){
                state_statement = state_statement.concat(`.OnExit(func(_ context.Context, _ ...any) error {\n${
                    value.onEntry.map((exit_action:any) => {
                        console.log(exit_action)
                        return `\t\t${NameForGolang(exit_action.type)}()\n`
                    }) 
                }\t}`)
            }


            // process on
            if(value.on){
                Object.entries(value.on).map(([key, events]) => {
                    console.log(events)
                    // @ts-ignore
                    if(events.length == 1){
                        // @ts-ignore
                        events.map((event:any) => {
                            // events
                            if(!event.cond){
                                event.target.map((target:any) => {
                                    state_statement = state_statement.concat(`.Permit(${NameForGolang(key)},${NameForGolang(target.id)})`)
                                })
                            }
                            // invoke
                            // WIP
        
                            // action
                            // WIP
                        })
                    }

                    // @ts-ignore
                    if(events.length == 2){
                        let condition = ""
                        // @ts-ignore
                        events.map((event:any) => {
                            // graud
                            // WIP
                            if(event.cond){
                                condition = NameForGolang(event.cond.name)
                                event.target.map((target:any) => {
                                    state_statement = state_statement.concat(`.Permit(${NameForGolang(key)},${NameForGolang(target.id)},func(_ context.Context, _ ...any) bool {
                                        panic("need to implement")
                                        return ${condition}()
                                    })`)
                                })
                            }else{
                                event.target.map((target:any) => {
                                    state_statement = state_statement.concat(`.Permit(${NameForGolang(key)},${NameForGolang(target.id)},func(_ context.Context, _ ...any) bool {
                                        panic("need to implement")
                                        return !${condition}()
                                    })`)
                                })

                            }
                        })


                    }
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