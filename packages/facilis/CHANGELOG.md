# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.1.0 (2026-07-14)

### Code Refactoring

- **facilis:** reshape core input snapshot pipeline ([82bd8a4](https://github.com/marksmccann/facilis/commit/82bd8a4aed6604f3ea76f452d7dd98af38b1b295))

### Features

- add phone number format and edit guards ([10db240](https://github.com/marksmccann/facilis/commit/10db240f628461b0385e9ed57be5611bdd1bfc64))
- **core:** add numeric blur and selection helpers ([ad4833e](https://github.com/marksmccann/facilis/commit/ad4833ebd272618334b528220328dd09f04fb382))
- establish facilis core packages ([89cb5fe](https://github.com/marksmccann/facilis/commit/89cb5fefed927e14e6c9e0d6e763466da40ec951))
- **formats:** add dedicated phone and currency formats ([9b11304](https://github.com/marksmccann/facilis/commit/9b11304919f4cba301d8b996da61dfbd43040b51))
- **formats:** add number format and currency options docs ([d63a5ed](https://github.com/marksmccann/facilis/commit/d63a5ed909ade65e50c6236479c6dc0fcd24d73e))
- **formats:** rebuild number format ([78d45f1](https://github.com/marksmccann/facilis/commit/78d45f1f00b30ac61b166a889ba0166e7eacf3f0))
- introduce pattern utility helpers in core + refactor pattern format ([372693a](https://github.com/marksmccann/facilis/commit/372693a403082af3268d27f5912b93accc12254a))
- **number:** add live min and max clamping to number ([9f9cd78](https://github.com/marksmccann/facilis/commit/9f9cd78b504f54302b730da6c30683b5f80be16a))
- **number:** add zero normalization options to number ([4080dd8](https://github.com/marksmccann/facilis/commit/4080dd84fce997f88aa0d9d41c387d82000d453b))
- **testing:** add pattern format and shared test harness ([7630e52](https://github.com/marksmccann/facilis/commit/7630e5275ba145abe56c94c81c1af9e24b49830b))

### BREAKING CHANGES

- **facilis:** onInput now requires inputType, previous, and current InputSnapshot arguments.
