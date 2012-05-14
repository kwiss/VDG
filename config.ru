#\ -s thin -p 4567
# sets `rackup` to use the thin web server on port 4567
# 
require 'bundler' # gem requires

# = map it out for me
# sprockets
map Sinatra::Application.settings.assets_prefix do
  run Sinatra::Application.sprockets
end
# main app
map '/' do
  run Sinatra::Application
end