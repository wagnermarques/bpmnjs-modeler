const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals')
const HtmlWebPackPlugin = require("html-webpack-plugin")


module.exports = (env, argv) => {

    //https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334
    const configNode = {
        target:'node',
        watch: true,
        watchOptions: {
            ignored: /node_modules/
        },
        node: {
            // Need this when working with express, otherwise the build fails
            __dirname: false,   // if you don't put this is, __dirname
            __filename: false,  // and __filename return blank or /
        },
        externals: [nodeExternals()], // Need this to avoid error when working with Express
        entry : {
            bundle: ['./src/server/server.js']
        },
        output: {
            path: __dirname + '/dist',
            filename: 'js/server.bundle.js'
        },

        module: {
            rules: [
                {
                    // Transpiles ES6-8 into ES5
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                }
            ]}
    }//const configNode = {
    
    const configWeb = {
        target : 'web', //web is default target value
        entry : {
            bundle: ['./src/js/app.js']
        },
        output: {
            path: __dirname + '/dist',
            filename: 'js/app.bundle.js'
        },
        plugins: [
            new CopyWebpackPlugin([
                { from: 'assets/**', to: 'libs/bpmnjs/bpmn-js',
                  context: 'node_modules/bpmn-js/dist/' },
                { from: 'resources/*.*', to: './'},
                { from: 'src/imgs/*', to: './imgs'},
                { from: 'src/index.html', to: './'},
                { from: '**/*.html', to: './html',context: 'src/html' },
                { from: '**/*.css', to: './css' ,context: 'src/css' }
            ])
        ],  
        module : {
            rules: [
                {
                    test: /\.bpmn$/,
                    use: 'raw-loader'
                },
                {
                    // Transpiles ES6-8 into ES5
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    // Loads the javacript into html template provided.
                    // Entry point is set below in HtmlWebPackPlugin in Plugins 
                    test: /\.html$/,
                    use: [
                        {
                            loader: "html-loader",
                            //options: { minimize: true }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [ 'style-loader', 'css-loader' ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: ['file-loader']
                }                
            ]
        },//module : {
        devServer:  {
            contentBase: __dirname + '/dist',
            compress: true,
            port: 9000
        }
    }//const configWeb = {
    


    //Common node and web config properties
    //this.output = {
    //    path: __dirname + '/dist',
    //    filename: 'bundle.js'
    //},

    //Object.assign(configWeb, this);


    
    //choose witch webpack config from properties    
    if(argv.buildTarget === "web"){
        if (argv.mode === 'development') {
            configWeb.devtool = 'source-map';
            return configWeb;
        }
    
        if (argv.mode === 'production') {
            configWeb.devtool = 'nosources-source-map';
            return configWeb;
        }
    }
    
    if(argv.buildTarget === "node"){
        console.log("if(argv.buildTarget === \"node\"){...");
        if (argv.mode === 'development') {
            configWeb.devtool = 'source-map';
            return configNode;
        }
        
        if (argv.mode === 'production') {
            configWeb.devtool = 'nosources-source-map';
            return configNode
        }
    }

    
    console.log("***Please, use --buildTarget node or --buildTarget web and --mode=development or --mode=productiong ");
    return null;
};


//module.exports = {
//    mode: 'development',    
//    devtool: 'source-map'
//};
