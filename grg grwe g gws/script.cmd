@echo off
SET str=%cd%/index.html
set str2="%20"
set str=%str: =" "%
start browser %str%