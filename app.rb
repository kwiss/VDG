Dir.glob('./app/**/*.rb') do |file|
  require file.gsub(/\.rb/, '')
end

helpers do
  include AssetHelper
  include Sprockets::Helpers
end

get '/' do
  @title = 'Hey there!'
  haml :index
end