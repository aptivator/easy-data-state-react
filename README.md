# easy-data-state-react

## Table of Contents

* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#usage)
  * [Generating a Hook Bound to an EasyDataState Instance](#generating-a-hook-bound-to-an-easydatastate-instance)
    * [Basic Example](#basic-example)
    * [Example with All Options](#example-with-all-options)
  * [Using useEasyDataState() hook](#using-useeasydatastate-hook)
  * [General Notes](#general-notes)
* [Development](#development)
  * [Development Setup](#development-setup)
  * [Contributing Changes](#contributing-changes)
* [`easy-data-state` vs. Other React Data Management Approaches](#easy-data-state-vs-other-react-data-management-approaches)
  * [Redux](#redux)
  * [Contexts](#contexts)
  * [Atom-Based Approaches](#atom-based-approaches)

<a name="introduction"></a>
## Introduction

The library provides React bindings to connect a component state to an `EasyDataState`
instance.  The bindings trigger a component render in response to the changes of the data
upon which a component depends.

<a name="installation"></a>
## Installation

To fetch the library, run the following command.

```
npm install --save easy-data-state-react
```

<a name="usage"></a>
## Usage

<a name="generating-a-hook-bound-to-an-easydatastate-instance"></a>
### Generating a Hook Bound to an EasyDataState Instance

`generateEasyDataStateHook()` accepts an `EasyDataState` object and returns a React hook
bound to the instance.  The hook accepts data state subscription address(es) and optional
default value and configurations.  The hook's fourth parameter is a flag (default `false`),
indicating whether to return an `EasyDateState` instance along with subscribed-to data.

<a name="basic-example"></a>
#### Basic Example

The code below is taken from the [example](./example/src/App.jsx) included in this repo.
It implements 100 `Counter` components with each listening to and being able to update
the global counter.

*data-state.js*
```javascript
import {EasyDataState}             from 'easy-data-state';
import {generateEasyDataStateHook} from 'easy-data-state-react';

export const state = new EasyDataState();
export const useGlobalState = generateEasyDataStateHook(state);
```

*component-file.jsx*
```javascript
import {state, useGlobalState} from './data-state';

function Counter() {
  let counter = useGlobalState('counter', 0);

  return <div>
    <button onClick = {() => state.write('counter', (counter = 0) => ++counter)}>
       Increment {counter}
     </button>
  </div>;
}
```

<a name="example-with-all-options"></a>
#### Example with All Options

The following example shows the usage of all of the parameters that can be
given to the generated state hook.

*component-file.jsx*
```javascript
import {useGlobalState} from './data-state';

export function SomeComponent() {
  let dataAddresses = [['permissions.collection', ['name', 'status']], 'info'];
  let defaultValue = {};
  let configs = {asArray: true};
  let returnState = true;
  let [[name = '', status = '', info = ''], state] = useGlobalState(dataAddresses, defaultValue, configs, returnState);

  return <>
    <div>{name}</div>
    <div>{status}</div>
    <div>{info}</div>
  <>;
}
```

*another-file.js*
```javascript
import {state} from './data-state';

state.write({
  'permissions.collection': {
    name: 'name', 
    status: 'valid'
  }, 
  info: 'i'
}); //triggers SomeComponent render
```

<a name="#using-useeasydatastate-hook"></a>
### Using useEasyDataState() hook

`useEasyDataState()` hook takes an `EasyDataState` instance and the addresses of
the data state that a component is "interested" in.  The function also accepts
default value and configurations.  For small implementations this approach may work
well.  For broader applications of `easy-data-state`, using `useEasyDataState()` will
require slightly more code because both the hook and the state object would have to
be imported.

*data-state.js*
```javascript
import {EasyDataState} from 'easy-data-state';

export const state = new EasyDataState();
```

*component-file.jsx*
```javascript
import {useEasyDataState} from 'easy-data-state-react';
import {state}            from './data-state';

export function SomeComponent() {
  let dataAddress = 'message',
  let defaultValue = [];
  let configs = {asArray: true};
  let [message = ''] = useEasyDataState(state, dataAddress, defaultValue, configs);

  return <div className='message'>{message}</div>;
}
```

*another-file.js*
```javascript
import {state} from './data-state';

state.write('message', 'some message'); //triggers SomeComponent render
```

<a name="general-notes"></a>
### General Notes

`useEasyDataState()` and the hook returned by `generateEasyDataStateHook()` accept
the same parameters (except the callback) as `easy-data-state`'s `subscribe()` method.
See `easy-data-state` [documentation](https://github.com/aptivator/easy-data-state)
for more details.

<a name="development"></a>
## Development

<a name="development-setup"></a>
### Development Setup

Perform the following steps to setup the repository locally.

```
git clone https://github.com/aptivator/easy-data-state-react.git
cd easy-data-state-react
npm install
```

To start development mode run `npm run dev` or `npm run dev:coverage`.

<a name="contributing-changes"></a>
### Contributing Changes

The general recommendations for contributions are to use the latest JavaScript
features, have tests with complete code coverage, and include documentation.
The latter may be necessary only if a new feature is added or an existing documented
feature is modified.

<a name="easy-data-state-vs-other-react-data-management-frameworks"></a>
## `easy-data-state` vs. Other React Data Management Approaches

<a name="redux"></a>
### Redux

Usage of Redux involves an opinionatedly systematized approach to write labyrinthine
code.  To propagate application data state changes requires stores, reducers, slices,
dispatchers, actions, context to link a React component to a data state, and explication
of operations that can be run on a piece of data.  These abstractions necessitate a code
boilerplate that takes extra time to write, maintain, and get up-to-speed with.  The
reader is encouraged to take a look at a Redux's example involving a simple counter
and all of the requisite code required to implement it.  For juxtaposition, a simple
counter example using `easy-data-state` can be seen [here](./example/src/App.jsx).

`easy-data-state` and its React bindings are designed to link UI components to the
application's data as easily as possible.  All a developer has to do is create an
`EasyDataState` object, generate a React hook bound to the instance, and then use
the hook in all of the components whose specific rendering is dependent upon some
application data.  `EasyDataState` instance is a non-React and framework-agnostic entity.
The instance can be created as a part of a software configuration and then imported and
used anywhere in the application, unbound by React's structures such as contexts.

<a name="contexts"></a>
### Contexts

Context (in React) is a data-passing mechanism that allows a parent component to make 
information available to its descendants.  Components "hook" into one or more contexts
and whenever a context is refreshed, React reruns all of the dependent components with
new data.  Each context can be viewed as a kind of a data bus for specific information.
This makes contexts an obtuse data distribution option.  For instance, an authentication
context may consist of, say, 5 pieces of data, yet not all components that tap into the
context may need all of the these.  All components, however, linked to the context will
be re-rendered when the context changes.  This has negative implications on performance
and can result in side-effects requiring caching of some data for some components between
updates.  Increasing the number of contexts will alleviate the problem somewhat while
exacerbating contexts' instantiation downsides.  Contexts require provider components to
activate them within the "markup" (JSX).  Updating a context requires re-render of its
provider.  Enabling re-renders involves inclusion of a function(s) within a context data
that would reset a provider component state, rerunning the component and its context.
Because contexts are structural, they are usually layered around an application component
that can be static or transcluded.  Sometimes this one-on-top-of-another onion-like layering
does not work necessitating more esoteric arrangements. All of these arrangements make
maintenance and testing more difficult.  Because contexts are structural, the logic that
updates them has to originate within them.

`easy-data-state` and its React interface have none of these problems.  Provider components
are not required.  There is no need for some custom JSX structure to encapsulate the application.
A component is re-rendered only when the component's subscribed-to data changes.  `EasyDataState`
instance is framework-agnostic and can be used anywhere within an application.  Testing of data
state-linked components is straightforward: only a component and an `EasyDataState` instance are
needed (see [tests](./test/easy-data-state-react.test.js)).  Performance is not compromised.  And,
the code footprint needed to facilitate all of that is several times smaller than that of contexts.

<a name="atom-based-approaches"></a>
### Atom-Based Approaches

Libraries such as Recoil and Jotai implement an atom-based data state model. Atoms are singular
pieces that are individually created and imported into dependent components.  Change in an atom's
value triggers re-processing of the atom-linked components.  Such an approach is an improvement
over Redux and Context.  `easy-data-state` does not implement a concept of an atom, but that of
a data state.  The latter is an entirety or a significant subset of data used by an application.
The abstraction implemented by `easy-data-state` allows interaction with an overarching data
management entity versus dealing with an implicit collection of atomic pieces each managing its
own state.

Practically, this translates into a more economical code.  Using atoms, more (probably way more)
than one atom would have to be created.  Each of the atoms have to be individually exported and
imported. A component that uses three atoms would have to import them separately along with
concomitant hooks and then invoke a respective hook with each atom.  With `easy-data-state` only
one state object is usually created.  If a component needs multiple pieces of data, then the data
addresses can be specified as an array in one data state subscription hook call.   If one of the
observed data changes, `easy-data-state` will provide the subscribed-to data as one collection.

Updating state values with this library requires just a state object.  With atom-based systems,
an atom has to be imported plus an appropriate hook.  Atom then has to be passed to a hook to get
an atom’s value setter, which is then called.  To update the values of multiple atoms, the above
process has to be repeated for each atom.  Updating/writing multiple values with `easy-data-state`
requires just one update call with data addresses and their new values specified as a plain object.

Libraries such as Recoil are fairly large.  `easy-data-state` and `easy-data-state-react` bindings
are under 400 lines with no dependencies.  The library is simpler, requires less code to use, is
faster than the alternatives, and allows management of a complex data state through a single instance.
