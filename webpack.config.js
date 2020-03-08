const fs = require('fs');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const LAMBDA_HANDLERS_FOLDER = path.join(__dirname, 'src/app/handlers');
const OUTPUT_FOLDER = path.join(__dirname, 'dist');

const lambdaEntryMap = fs
    .readdirSync(LAMBDA_HANDLERS_FOLDER)
    .filter(path => !path.endsWith('.ts'))
    .reduce(
        (acc, name) => ({
            ...acc,
            [name]: path.join(LAMBDA_HANDLERS_FOLDER, name, 'index.ts'),
        }),
        {}
    );

const commonConfig = {
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    node: {
        __dirname: false,
    },
};

const appConfig = {
    ...commonConfig,
    entry: lambdaEntryMap,
    output: {
        path: path.join(OUTPUT_FOLDER, 'app/handlers'),
        libraryTarget: 'commonjs2',
        filename: '[name]/index.js',
    },
};

const infrastructureConfig = {
    ...commonConfig,
    entry: {
        index: path.join(__dirname, 'src/infrastructure/index.ts'),
    },
    output: {
        path: path.join(OUTPUT_FOLDER, 'infrastructure'),
        libraryTarget: 'commonjs2',
        filename: 'index.js',
    },
    optimization: {
        minimize: false,
        concatenateModules: false,
    },
    externals: [nodeExternals()],
};

module.exports = (_, argv) => {
    if (argv.mode === 'development') {
        appConfig.externals = [nodeExternals()];
    }

    return [appConfig, infrastructureConfig];
};
