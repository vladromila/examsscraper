from telethon.sync import TelegramClient
from telethon.tl.functions.messages import GetDialogsRequest
from telethon.tl.types import InputPeerEmpty
import csv

api_id = 1625731
api_hash = '2a787e8e0b4b3a97e3db9ffa7078ae38'
phone = '+40757781970'
client = TelegramClient(phone, api_id, api_hash)

client.connect()
if not client.is_user_authorized():
    client.send_code_request(phone)
    client.sign_in(phone, input('Enter the code: '))


chats = []
last_date = None
chunk_size = 10
groups = []

result = client(GetDialogsRequest(
    offset_date=last_date,
    offset_id=0,
    offset_peer=InputPeerEmpty(),
    limit=chunk_size,
    hash=0
))
chats.extend(result.chats)

for chat in chats:
    try:
        groups.append(chat)
    except:
        continue

print('Selectati unul din grupurile urmatoare:')
i = 0
for g in groups:
    print(str(i) + '- ' + g.title)
    i += 1

g_index = input("Introduceti numarul grupului: ")
target_group = groups[int(g_index)]

print('Se extrage lista membrilor...')
all_participants = []
all_participants = client.get_participants(target_group, aggressive=True)

print('Se salveaza fisierul...')
with open("membrii.csv", "w", encoding='UTF-8') as f:
    writer = csv.writer(f, delimiter=",", lineterminator="\n")
    writer.writerow(['Nume'])
    for user in all_participants:
        name = ""
        space = " "
        if user.first_name:
            name = name+user.first_name
        if user.last_name:
            name = name+space+user.last_name
        writer.writerow([name])
print('Lista de membrii a fost salvata cu succes.')
