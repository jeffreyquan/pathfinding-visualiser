# Pathfinding Visualiser

## Table of Contents

- [Live Demo](#demo)
- [Introduction](#introduction)
- [How to get started](#how-to-get-started)
- [Technologies](#technologies)
- [Key Features](#key-features)
- [Future Developments](#future-developments)

<a name="demo"></a>

## Live Demo

[Pathfinding Visualiser](https://jeffreyquan.github.io/pathfinding-visualiser/)

<a name="introduction"></a>

## Introduction

This project is designed to visualise pathfinding algorithms.

Currently, it incorporates the following algorithms:

- [A\*](https://en.wikipedia.org/wiki/A*_search_algorithm)
- [Dijkstra](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)

It was inspired by [Clément Mihailescu](https://github.com/clementmihailescu) who has a tutorial on how to get started with this project:

- [YouTube](https://www.youtube.com/watch?v=msttfIHHkak&ab_channel=Cl%C3%A9mentMihailescu)
- [Github Repo](https://github.com/clementmihailescu/Pathfinding-Visualizer-Tutorial)

<a name="how-to-get-started"></a>

## How to get started

After cloning:

1. Run `npm install` and
2. Run `npm run start`

<a name="technologies"></a>

## Technologies

- [React](https://reactjs.org/)
- [reactstrap](https://reactstrap.github.io/)

Followed [How to deploy React App to GitHub Pages](https://dev.to/yuribenjamin/how-to-deploy-react-app-in-github-pages-2a1f)

<a name="key-features"></a>

## Key Feaures

- **Visualise the cells visited by the algorithm**
- **Visualise the shortest path**
- **Move start and finish node** - click on the start or finish node to place them in another position
- **Place walls** - click on empty cells to place walls
- **Generate maze** - generate random mazes

<a name="future-developments"></a>

## Future Developments

- Adding more algorithms
- Able to add weights
- Adjust speed of pathfinding
- Adjust grid sizing
