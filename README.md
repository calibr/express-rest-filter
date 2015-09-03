parse filter, order, range params for get requests
 
filter=userId eq 123223
filter=userId eq 123223;email eq "123123" 
filter=userId eq "123123"
filter=userId like "sad%"
filter=userId in [123, 123, 123]
filter=userId between [123, 321]

order=userId asc; name asc

range=30 10 (limit offset?)