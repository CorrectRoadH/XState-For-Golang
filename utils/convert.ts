
import { TypegenConstraint, TypegenDisabled,  } from 'xstate/lib/typegenTypes';
import { AnyEventObject, BaseActionObject, EventObject, MachineConfig, Typestate, ServiceMap,TransitionsConfig,StateNodeConfig, StatesConfig, StateSchema } from 'xstate/lib/types';
import { NameForGolang } from './go';
import { createMachine } from 'xstate';
interface Event {
    name: string;
    event: EventObject;
}

interface State {
    name: string;
    state: StateNodeConfig<any, StateSchema, EventObject, BaseActionObject>;
}

function getEventFromState(state:State):Event[]{
    const events:Event[] = []
        if(state.state.on){
            Object.entries(state.state.on).map(([key, value]) => {
                events.push({
                    name: NameForGolang(`${state.name}_${key}`),
                    event: value as EventObject
                })
            })
        }

    return events
}

function getEvents(config:MachineConfig<any, any, EventObject, BaseActionObject, any,any>):Event[]{
    const queue:State[] = []
    const events:Event[] = []
    Object.entries(config.states || {}).map(([key, value]) => {
        queue.push({
            name: NameForGolang(key),
            state: value as StateNodeConfig<any, any, EventObject, any>
        })
    })

    while (queue.length > 0) {
        const state = queue.shift()
        if(state){
            events.push(...getEventFromState(state))
        }
        if(state?.state.states){
            Object.entries(state.state.states).map(([key, value]) => {
                queue.push({
                    name: NameForGolang(`${state.name}_${key}`),
                    state: value as StateNodeConfig<any, any, EventObject, any>
                })
            })
        }
    }
    return events
}


function getStates(config:MachineConfig<any, any, EventObject, BaseActionObject, any,any>):State[]{
    const queue:State[] = []
    const states:State[] = []
    Object.entries(config.states || {}).map(([key, value]) => {
        queue.push({
            name: NameForGolang(key),
            state: value as StateNodeConfig<any, any, EventObject, any>
        })
    })

    while (queue.length > 0) {
        const state = queue.shift()
        if(state){
            states.push(state)
        }
        if(state?.state.states){
            Object.entries(state.state.states).map(([key, value]) => {
                queue.push({
                    name: NameForGolang(`${state.name}_${key}`),
                    state: value as StateNodeConfig<any, any, EventObject, any>
                })
            })
        }
    }
    return states
}


export function convert<TContext, TEvent extends EventObject = AnyEventObject, TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
}, TServiceMap extends ServiceMap = ServiceMap, TTypesMeta extends TypegenConstraint = TypegenDisabled>(config:MachineConfig<TContext, any, TEvent, BaseActionObject, TServiceMap, TTypesMeta>):string{

    const fetchMachine = createMachine<any>(config as MachineConfig<any, any, any, any>)
    console.log(fetchMachine)
//     const events = getEvents(config as MachineConfig<any, any, any, any>)
//     const states = getStates(config as MachineConfig<any, any, any, any>)

//     console.log(events)
//     const golangCode = `import "github.com/qmuntal/stateless"

// type State string
// const (\n ${Object.entries(config.states || {}).map(([key, value]) => `\t${key} State = "${key}"`).join('\n')}
//     )

// type Trigger string
// const (\n ${
//     events.map((event) => `\t${event.name} Trigger = "${event.name}"`).join('\n')}
// )

// func ${config.id}() *stateless.StateMachine {
// 	machine := stateless.NewStateMachine(${String(config.initial)})
    
//     ${states.map((state) => {
//         return `machine.Configure(${state.name})${
//             state.state.on ? Object.entries(state.state.on).map(([key, value]) => {
//                 const event = events.find((event) => event.name === NameForGolang(`${state.name}_${key}`))
//                 // @ts-ignore
//                 // TODO: fix this
//                 return `.Permit(${key}, ${NameForGolang(event?.event?.target) || '未知'})`
//             }).join('\n\t\t') : ''
//         }`
//     }).join('\n\t')}
    
//     return machine
// }`

//     return golangCode;
}
    
    
// import { createMachine, assign } from 'xstate';

// interface Context {
//     retries: number;
//   }
  
//   const fetchMachine = createMachine<Context>({
//     id: 'fetch',
//     initial: 'idle',
//     context: {
//       retries: 0
//     },
//     states: {
//       idle: {
//         on: {
//           FETCH: 'loading'
//         }
//       },
//       loading: {
//         on: {
//           RESOLVE: 'success',
//           REJECT: 'failure'
//         }
//       },
//       success: {
//         type: 'final'
//       },
//       failure: {
//         on: {
//           RETRY: {
//             target: 'loading',
//             actions: assign({
//               retries: (context, event) => context.retries + 1
//             })
//           }
//         }
//       }
//     }
//   });

//   fetchMachine.states