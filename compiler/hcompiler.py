import re

# **************************************************************************************************************
#
#										Class representing a single note
#
# **************************************************************************************************************

class Note:
	def __init__(self,note,semitoneAdjustment = 0):
		note = note.upper().strip()
		m = re.match("^([A-G])([/#]?)([1-9])$",note)
		assert m is not None,"Bad note definition ("+note+")"
		self.noteList = [ "C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
		self.noteIndex = self.noteList.index(note[:-1])
		self.noteIndex += (int(note[-1])-1) * 12
		self.noteIndex += semitoneAdjustment

	def getIndex(self):
		return self.noteIndex

	def getName(self):
		return self.noteList[self.noteIndex%12] + str(int(self.noteIndex/12)+1)

# **************************************************************************************************************
#
#									Class representing a C Diatonic Harmonica.
#
# **************************************************************************************************************

class DiatonicHarmonica:
	def __init__(self,semitoneAdjustment = 0):
		self.blowNotes = "C4 E4 G4 C5 E5 G5 C6 E6 G6 C7".split(" ")
		self.drawNotes = "D4 G4 B4 D5 F5 A5 B5 D6 F6 A6".split(" ")
		for i in range(0,10):
			self.blowNotes[i] = Note(self.blowNotes[i],semitoneAdjustment)
			self.drawNotes[i] = Note(self.drawNotes[i],semitoneAdjustment)
		self.blowNotes.insert(0,None)
		self.drawNotes.insert(0,None)

	def getBlow(self,n):
		assert n>= 1 and n <= 10,"Bad hole "+str(n)
		return self.blowNotes[n]

	def getDraw(self,n):
		assert n>= 1 and n <= 10,"Bad hole "+str(n)
		return self.drawNotes[n]

	def show(self):
		self.showHoles(self.blowNotes)
		self.showHoles(self.drawNotes)

	def showHoles(self,notes):
		notes = [(x.getName()+"  ")[:3] for x in notes[1:]]
		notes = "|".join([" "+x+" " for x in notes])
		print("["+notes+"]")

hm = DiatonicHarmonica(1)
hm.show()