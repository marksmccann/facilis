# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.1.0 (2026-07-14)

### Bug Fixes

- **formats:** ignore middle inserts when filled ([9c1637c](https://github.com/marksmccann/facilis/commit/9c1637c18ecd0954f604e5090923fbc407947dbf))
- **testing:** typecheck package sources ([e2d5596](https://github.com/marksmccann/facilis/commit/e2d5596c94252d01914fa19028d298af8292bf25))

### Code Refactoring

- **facilis:** reshape core input snapshot pipeline ([82bd8a4](https://github.com/marksmccann/facilis/commit/82bd8a4aed6604f3ea76f452d7dd98af38b1b295))

### Features

- add percent format ([7de691c](https://github.com/marksmccann/facilis/commit/7de691caa11806d62b76f9c6d5bb9359c72428ba))
- add phone number format and edit guards ([10db240](https://github.com/marksmccann/facilis/commit/10db240f628461b0385e9ed57be5611bdd1bfc64))
- **core:** add numeric blur and selection helpers ([ad4833e](https://github.com/marksmccann/facilis/commit/ad4833ebd272618334b528220328dd09f04fb382))
- **dom:** support selector targets in bind ([7266af5](https://github.com/marksmccann/facilis/commit/7266af5244367e162d23b3d37bf609a1a21e6579))
- establish facilis core packages ([89cb5fe](https://github.com/marksmccann/facilis/commit/89cb5fefed927e14e6c9e0d6e763466da40ec951))
- **facilis-formats:** complete number format behavior ([c5c2d47](https://github.com/marksmccann/facilis/commit/c5c2d47895c01cc6752e486482fc9bf123b29e8e))
- **facilis-formats:** implement currency format ([501622f](https://github.com/marksmccann/facilis/commit/501622f2327bac5d099025bd41b275480a4b7eef))
- **formats:** add alpha token for pattern format ([0e78385](https://github.com/marksmccann/facilis/commit/0e78385fc848cff0c1becc29569ad6fe6b5c33c0))
- **formats:** add credit card format ([a33addb](https://github.com/marksmccann/facilis/commit/a33addb318fa30cb3a50a06b83caabeb6207943e))
- **formats:** add date format ([3c8a3b9](https://github.com/marksmccann/facilis/commit/3c8a3b92ded6ffdbf344e11a0c6f31a47290a523))
- **formats:** add date leading zero option ([c566f79](https://github.com/marksmccann/facilis/commit/c566f7971d66b9d23427e93a4c6aed6f451768ca))
- **formats:** add dedicated phone and currency formats ([9b11304](https://github.com/marksmccann/facilis/commit/9b11304919f4cba301d8b996da61dfbd43040b51))
- **formats:** add ein format ([a0438ec](https://github.com/marksmccann/facilis/commit/a0438ece5620a519cba1f529d9811d95c7d217d0))
- **formats:** add expiration date format ([a24f49e](https://github.com/marksmccann/facilis/commit/a24f49e2a59e3af48d6f937fff77a99d94cf23ac))
- **formats:** add number format and currency options docs ([d63a5ed](https://github.com/marksmccann/facilis/commit/d63a5ed909ade65e50c6236479c6dc0fcd24d73e))
- **formats:** add social security number format ([691413a](https://github.com/marksmccann/facilis/commit/691413aff1f171908a47112aaa8f68e04a7c9961))
- **formats:** add strict date month and day option ([befa637](https://github.com/marksmccann/facilis/commit/befa637fa46d0620ba7a8fee946cfda6eac28bc6))
- **formats:** add text format ([0f128d1](https://github.com/marksmccann/facilis/commit/0f128d1fbe72eaa6bffb747311e2e0ea03ead317))
- **formats:** add time format ([dc959ad](https://github.com/marksmccann/facilis/commit/dc959ad5007b2dc0fbf69882776c0899a6ea5d7c))
- **formats:** add zip code format ([dfd2779](https://github.com/marksmccann/facilis/commit/dfd27791ced2e891fb512d435fae40a37b9eb443))
- **formats:** make currency options configurable ([c0e490e](https://github.com/marksmccann/facilis/commit/c0e490ebc52ef0a182776bb017feafee54ba3951))
- **formats:** rebuild number format ([78d45f1](https://github.com/marksmccann/facilis/commit/78d45f1f00b30ac61b166a889ba0166e7eacf3f0))
- **formats:** relax pattern literal boundaries ([a89867c](https://github.com/marksmccann/facilis/commit/a89867cf8dc3821c2c6249a1309500fc617fba96))
- introduce pattern utility helpers in core + refactor pattern format ([372693a](https://github.com/marksmccann/facilis/commit/372693a403082af3268d27f5912b93accc12254a))
- **number:** add live min and max clamping to number ([9f9cd78](https://github.com/marksmccann/facilis/commit/9f9cd78b504f54302b730da6c30683b5f80be16a))
- **number:** add zero normalization options to number ([4080dd8](https://github.com/marksmccann/facilis/commit/4080dd84fce997f88aa0d9d41c387d82000d453b))
- **pattern:** default object tokens to shorthand presets ([58d8975](https://github.com/marksmccann/facilis/commit/58d8975a85adb7235204d2a7ae815cada13458e2))
- **pattern:** handle backward literal deletion ([5d81ea5](https://github.com/marksmccann/facilis/commit/5d81ea50fd03e3f69420aa4e975396b2ca8bb0d3))
- **react:** add useFormat hook ([585f90c](https://github.com/marksmccann/facilis/commit/585f90cc7a6883c71f4262c526d3da031e4c75eb))
- **testing:** add input helpers for format tests ([5048264](https://github.com/marksmccann/facilis/commit/504826402c8c81136335418d88dd6cf0d76d0c3a))
- **testing:** add pattern format and shared test harness ([7630e52](https://github.com/marksmccann/facilis/commit/7630e5275ba145abe56c94c81c1af9e24b49830b))

### BREAKING CHANGES

- **facilis:** onInput now requires inputType, previous, and current InputSnapshot arguments.
