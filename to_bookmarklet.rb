#!/usr/bin/env ruby -w

require 'uri'

path = 'extras/bookmarklet.js'

def cleanUpAndPrint js
  js = js.strip
         .gsub(/\n/,'')
         .gsub(/\s{2,}/,'')
         .gsub( /\/\*.+?\*\/|\/\/.*(?=[\n\r])/, '' )
         .gsub( /s{\t}{ }gm/, '' )
         .gsub( /s{ +}{ }gm/, '' )
         .gsub( /s{^\s+}{}gm/, '' )
         .gsub( /s{\s+$}{}gm/, '' )
         .gsub( /s{\n}{}gm/, '' )


  escaped_js = URI.escape(js)
  print "javascript:(function(){#{escaped_js}}());"
end

if File.exists? path
  js = File.read path
  cleanUpAndPrint(js)
else
  puts 'Could not load extras/bookmarklet.js'
  return
end

