# Poetri CLI

CLI for managing your account, teams and projects at [Poetri](https://poetri.co).

## Install 

```
npm i -g @poetri/cli
```

## Usage

Get help using the following command.

```
poetri -h
```

You'll find something like this.

```
Usage: poetri [options] [command]

Options:
  -V, --version  output the version number
  -h, --help     output usage information

Commands:
  init           creates a new project
  signup         registers an user
  signin         logs-in an user
  help [cmd]     display help for [cmd]
```

### Sign Up

Registers a new user on Poetri.

```
Usage: poetri-signup [options]

Registers a new user on Poetri.

Options:
  -m --mail <mail>  mail for the user
  -h, --help        output usage information
```

### Sign In

Signs a Poetri user in.

```
Usage: poetri-signin [options]

Signs a Poetri user in.

Options:
  -m --mail <mail>  mail for the user
  -h, --help        output usage information
```

## License

[MIT License](LICENSE)
