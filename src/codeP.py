A = 19
B = True
for I in range (2,A//2) :
	
	if(A%I==0) :
		B = False
if (B==True) :
	print("premier")
else :
	print("pas premier")