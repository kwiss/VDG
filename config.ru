require 'bundler'
Bundler.require(:default, ENV['RACK_ENV'].to_sym)

require './app'
require './assets'

# Assets
map Sinatra::Application.settings.assets_prefix do
  run Sinatra::Application.sprockets
end

# App
map '/' do
  run Sinatra::Application
end
