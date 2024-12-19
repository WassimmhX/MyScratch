with open('../src/result.txt', 'r') as file:
    text=file.read()
text=text.strip()
with open('../src/codeP.py', 'w') as file:
    file.write(text)
    file.close()
print("Success")